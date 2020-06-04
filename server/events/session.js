const User = require('../models/user-model');
const help = require('../util/helpers');

async function login(emailOrUsername, password) {
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (user && user.comparePasswords(password)) {
      const sessionUser = help.sessionizeUser(user);

      socket.request.session.user = sessionUser;
      return sessionUser;
    } else {
      throw new Error('Неверные логин или пароль');
    }
  } catch (err) {
    return err;
  }
}

function logout(socket) {
  try {
    const user = socket.request.session.user;
    console.log('user');
    if (user) {
      socket.request.session.destroy((err) => {
        if (err) throw err;
        //res.clearCookie('MessengerCookie');
        return user;
      });
    } else {
      throw new Error('Что-то пошло не так');
    }
  } catch (err) {
    return err;
  }
}

function loadUser(socket) {
  console.log(socket.request.session.user);
  socket.emit('returnLoadUser', socket.request.session)
}

const sessionHub = { login, logout, loadUser };

module.exports = sessionHub;

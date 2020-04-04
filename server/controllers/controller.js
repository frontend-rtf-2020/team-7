const User = require('../models/user-model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
let receivers;
let randomCode;

function hash (text) {
  return crypto.createHash('sha1')
    .update(text).digest('base64')
}

function sendEmail () {
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAILLOGIN,
      pass: process.env.EMAILPASS
    }
  });

  // Генерация рандомной строки длиной в 6 символов
  function str_rand () {
    let result = '';
    const words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    const max_position = words.length - 1;
    for (i = 0; i < 6; ++i) {
      position = Math.floor(Math.random() * max_position);
      result = result + words.substring(position, position + 1)
    }
    return result
  }
  const randomCode = str_rand();

  // send mail with defined transport object
  const info = transporter.sendMail({
    from: 'MessangerBot@yandex.ru', // sender address
    to: receivers, // list of receivers
    subject: 'Проверочный код', // Subject line
    text: 'Проверочный код: ' + randomCode // plain text body
  });

  return randomCode
}

createUser = (req, res) => {
  const body = {
    email: req.body.email,
    username: req.body.username,
    password: hash(req.body.password)
  };

  const user = new User(body);

  if (!user) {
    return res.status(400).json({ success: false, error: err })
  }

  if (req.body.randomCode.length === 0) {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err })
      }
      if (!user) {
        receivers = req.body.email;
        randomCode = sendEmail(receivers);
        res.status(201).json()
      } else { return res.status(400).json({ success: false, error: err }) }
    }
    )
  }

  const enteredCode = req.body.randomCode;
  console.log('Исходник ' + randomCode + '    Введенный ' + enteredCode);
  if (enteredCode === randomCode && req.body.randomCode.length !== 0) {
    user
      .save()
      .then(() => {
        return res.status(201).json({
          success: true,
          id: user._id,
          message: 'Пользователь создан!'
        })
      })
      .catch(error => {
        return res.status(400).json({
          error,
          message: 'Пользователь не создан!'
        })
      })
  }
};

loadUser = async (req, res) => {
  if (req.session._id) {
    User.findById(req.session._id, function (user) {
      if (user) {
        req.currentUser = user;
        return res.status(201).json({
          success: true,
          id: user._id
        })
      } else {
        return res.status(400).json({
          success: false
        })
      }
    })
  } else {
    return res.status(400).json({
      success: false
    })
  }
};

updateUserById = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Не все поля заполнены'
    })
  }

  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({
        err,
        message: 'Пользователь не найден!'
      })
    }
    user.email = body.email;
    user.username = body.username;
    user.password = hash(body.password);
    user
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: user._id,
          message: 'Данные о пользователе изменены!'
        })
      })
      .catch(error => {
        return res.status(404).json({
          error,
          message: 'Данные о пользователе не изменены!'
        })
      })
  })
};

login = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Не все поля заполнены'
    })
  }

  const email = body.email;
  const password = hash(body.password);
  User.findOne({ email: email, password: password }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }
    if (user) {
      return res.status(201).json({
        success: true,
        id: user._id,
        message: 'Пользователь найден!'
      })
    } else {
      return res
        .status(404)
        .json({
          success: false, error: 'Пользователь не найден'
        })
    }
  }
  )
};

logout = async (req, res) => {
  if (req.session) {
    return res.status(200).json()
  }
};

getUserById = async (req, res) => {
  await User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: 'Пользователь не найден' })
    }
    return res.status(200).json({ success: true, data: user })
  }).catch(err => console.log(err))
};

getUsersByUsername = async (req, res) => {
  await User.find({ username: req.params.username }, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }
    if (!users.length) {
      return res
        .status(404)
        .json({ success: false, error: 'Пользователи не найдены' })
    }
    return res.status(200).json({ success: true, data: users })
  }).catch(err => console.log(err))
};

module.exports = {
  createUser,
  updateUserById,
  login,
  logout,
  getUsersByUsername,
  getUserById,
  loadUser
};

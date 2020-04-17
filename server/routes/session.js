const express = require("express");
const Joi = require("joi");
const User = require("../models/user-model");
const help = require("../util/helpers");

const sessionRouter = express.Router();

sessionRouter.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await User.findOne({ $or: [ {email: emailOrUsername}, {username: emailOrUsername } ] });
    if (user && user.comparePasswords(password)) {
      const sessionUser = help.sessionizeUser(user);

      req.session.user = sessionUser
      res.send(sessionUser);
    } else {
      throw new Error('Неверные логин или пароль');
    }
  } catch (err) {
    res.status(401).send(help.parseError(err));
  }
});

sessionRouter.delete("/logout", ({ session }, res) => {
  try {
    const user = session.user;
    if (user) {
      session.destroy(err => {
        if (err) throw (err);
        res.clearCookie('MessengerCookie');
        res.send(user);
      });
    } else {
      throw new Error('Что-то пошло не так');
    }
  } catch (err) {
    res.status(422).send(help.parseError(err));
  }
});

sessionRouter.get("/loadUser", ({ session: { user }}, res) => {
  res.send({ user });
});

module.exports = sessionRouter;

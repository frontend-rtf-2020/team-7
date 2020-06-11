const Joi = require('joi');
const express = require('express');
const User = require('../models/user-model');
const validation = require('../validations/user');
const additions = require('../util/helpers');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const userRouter = express.Router();

userRouter.post('/sendemail', async (req, res) => {
  try {
    const { email, username, password, code } = req.body;
    await Joi.validate({ email, username, password }, validation.signUp);
    const user = await User.findOne({ $or: [{ email: email }, { username: username }] });
    if (!user) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAILLOGIN,
          pass: process.env.EMAILPASS,
        },
      });

      const code = crypto.randomBytes(10).toString('hex');

      // send mail with defined transport object
      const info = transporter.sendMail({
        from: process.env.BOTEMAIL, // sender address
        to: email, // list of receivers
        subject: 'Проверочный код', // Subject line
        text: 'Проверочный код: ' + code, // plain text body
      });
      const newUser = new User({ email: email, username: username, code: code });
      await newUser.save();
      res.status(400).json({
        message: 'Письмо с кодом подтверждения отправлено!',
      });
    }
    const match = await User.findOne({ email: email, code: /[\w\d]*/ });
    if (match.length !== 0) {
      res.status(400).json({
        message: 'Подтвердите ваш email, введя код подтверждения из письма!',
      });
    }
    else if (user && code === '') {
      res.status(400).json({
        message: 'Email или username уже используются!',
      });
    }
  } catch (err) {
    res.status(400).send(additions.parseError(err));
  }
});

userRouter.post('/signup', async (req, res) => {
  try {
    const { email, username, password, code } = req.body;
    const user = await User.findOne({ email: email, code: code });
    if (user) {
      await User.findOneAndDelete({ email: email });
      await Joi.validate({ email, username, password }, validation.signUp);
      const newUser = new User({ email, username, password });
      const sessionUser = additions.sessionizeUser(newUser);
      await newUser.save();
      req.session.user = sessionUser;
      res.send(sessionUser);
    }
    const checkUser = await User.findOne({ email: email });
    if (!user && checkUser && code !== '') {
      res.status(400).json({
        message: 'Проверьте введенный проверочный код!',
      });
    }
  } catch (err) {
    res.status(400).send(additions.parseError(err));
  }
});

module.exports = userRouter;

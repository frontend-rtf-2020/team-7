const Joi = require('joi');

const messageForEmail = 'должен быть рабочим';
const email = Joi.string()
  .regex(/^\S+@\S+\.\S+$/)
  .options({
    language: {
      string: {
        regex: {
          base: messageForEmail,
        },
      },
    },
  })
  .required();

const messageForUsername =
  'должен содержать от 3 до 20 букв английского языка или цифр, ' +
  'но не должен содержать никаких спец. символов';
const username = Joi.string()
  .regex(/^[a-z0-9]{3,20}$/i)
  .options({
    language: {
      string: {
        regex: {
          base: messageForUsername,
        },
      },
    },
  })
  .required();

const messageForPassword =
  'должен содержать от 6 до 16 символов, ' +
  'иметь как минимум одну заглавную букву, ' +
  'одну строчную букву и одну цифру';
const password = Joi.string()
  .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{6,16}$/)
  .options({
    language: {
      string: {
        regex: {
          base: messageForPassword,
        },
      },
    },
  });

const signUp = Joi.object().keys({
  email,
  username,
  password,
});

module.exports = {
  signUp,
};

const Joi = require("joi");

const email = Joi.string()
  .email()
  .required();
const username = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required();
const message =
  "должен содержать от 6 до 16 символов, " +
  "иметь как минимум одну заглавную букву, " +
  "одну строчную букву, одну цифру " +
  "и один специальный символ";
const password = Joi.string()
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
  .options({
    language: {
      string: {
        regex: {
          base: message
        }
      }
    }
  });

const signUp = Joi.object().keys({
  email,
  username,
  password
});

module.exports = {
  signUp
}
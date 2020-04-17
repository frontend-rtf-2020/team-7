const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: email => User.doesNotExist({ email }),
      message: "Адрес электронной почты уже используется"
    }
  },
  username: {
    type: String,
    validate: {
      validator: username => User.doesNotExist({ username }),
      message: "Имя пользователя уже занято"
    }
  },
  password: {
    type: String
  },
  code: {
    type: String
  }
}, { timestamps: true });

UserSchema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
});

UserSchema.statics.doesNotExist = async function (field) {
  return await this.where(field).countDocuments() === 0;
};

UserSchema.methods.comparePasswords = function (password) {
  return bcrypt.compareSync(password, this.password);
};
const User = mongoose.model('User', UserSchema);
module.exports = User;
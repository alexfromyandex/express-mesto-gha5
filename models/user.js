const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длинна 2 символа'],
    maxlength: [30, 'Максимальная длинна 30 символов'],
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длинна 2 символа'],
    maxlength: [30, 'Максимальная длинна 30 символов'],
  },

  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm.test(v);
      },
      message: 'Введен некорректный URL',
    },
  },

  email: {
    type: String,
    required: { value: true, message: 'Поле является обязвтельным' },
    uniqe: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введен некорректный email',
    },
  },

  password: {
    type: String,
    required: { value: true, message: 'Поле является обязвтельным' },
    minlength: [8, 'Минимальная длинна 8 символа'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);

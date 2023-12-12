const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: { value: true, message: "Поле является обязвтельным" },
    minlength: [2, "Минимальная длинна 2 символа"],
    maxlength: [30, "Минимальная длинна 30 символов"],
  },

  about: {
    type: String,
    required: { value: true, message: "Поле является обязвтельным" },
    minlength: [2, "Минимальная длинна 2 символа"],
    maxlength: [30, "Минимальная длинна 30 символов"],
  },

  avatar: {
    type: String,
    required: { value: true, message: "Поле является обязвтельным" },
  },
});

module.exports = mongoose.model("user", userSchema);

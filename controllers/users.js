const User = require("../models/user");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-__v");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//_____________________________________________________________________________________________________________________________________

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("-__v")
      .orFail(() => {
        throw new Error("Пользователь по указанному _id не найден.");
      });
    return res.status(200).json(user);
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные пользователя" });
      default:
        return res.status(500).send({ message: error.message });
    }
  }
};

//_____________________________________________________________________________________________________________________________________

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    switch (error.name) {
      case "ValidationError":
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      case "MongoServerError":
        if (error.code === 11000) {
          return res.status(409).send({
            message: "Пользователь с таким именем уже существует.",
          });
        }
        return res.status(500).send({ message: error.message });
      default:
        return res.status(500).send({ message: error.message });
    }
  }
};

//_____________________________________________________________________________________________________________________________________

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((updateData) => res.send({ data: updateData }))
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(400).send({
          message: "Пользователь с указанным _id не найден.",
        });
      } else if (error.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else {
        return res.status(500).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

//_____________________________________________________________________________________________________________________________________

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((updateAvatar) => res.send({ data: updateAvatar }))
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(400).send({
          message: "Пользователь с указанным _id не найден.",
        });
      } else if (error.name === "ValidationError") {
        return res.status(404).send({
          message: "Переданы некорректные данные при обновлении автара.",
        });
      } else {
        return res.status(500).send({ message: `На сервере произошла ошибка: ${error}` });
      }
    });
};

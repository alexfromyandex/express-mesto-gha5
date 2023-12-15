const User = require('../models/user');
const {
  CreatedStatus,
  BadRequestStatus,
  NotFoundStatus,
  ConflictStatus,
  InternalServerStatus,
  MongoDuplicateCode,
} = require('../utils/ErrorStatus');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-__v');
    return res.json(users);
  } catch (error) {
    return res.status(InternalServerStatus).send({ message: 'Ошибка сервера' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-__v');
    if (user) {
      return res.json(user);
    }
    return res
      .status(NotFoundStatus)
      .send({ message: 'Пользователь по указанному _id не найден.' });
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res
          .status(BadRequestStatus)
          .send({ message: 'Переданы некорректные данные пользователя' });
      default:
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(CreatedStatus).json(newUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(BadRequestStatus).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      case 'MongoServerError':
        if (error.code === MongoDuplicateCode) {
          return res.status(ConflictStatus).send({
            message: 'Пользователь с таким именем уже существует.',
          });
        }
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
      default:
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
    }
  }
};

module.exports.updateUserData = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (userUpdate) {
      return res.send(userUpdate);
    }
    return res.status(NotFoundStatus).send({
      message: 'Пользователь с указанным _id не найден.',
    });
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(BadRequestStatus).send({
          message: 'Неверно указанным _id пользователя.',
        });
      case 'ValidationError':
        return res.status(BadRequestStatus).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      default:
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
    }
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const avatarUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (avatarUpdate) {
      return res.json(avatarUpdate);
    }
    return res.status(NotFoundStatus).send({
      message: 'Пользователь с указанным _id не найден.',
    });
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(BadRequestStatus).send({
          message: 'Неверно указанным _id пользователя.',
        });
      case 'ValidationError':
        return res.status(BadRequestStatus).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      default:
        return res
          .status(InternalServerStatus)
          .send({ message: 'Ошибка сервера' });
    }
  }
};

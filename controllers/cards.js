const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const UserRightsError = require('../errors/UserRightsError');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(new InternalServerError('Ошибка сервера'));
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.json(card);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.'
          )
        );
      default:
        return next(new InternalServerError('Ошибка сервера'));
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.cardId);
    if (!deletedCard || null) {
      return next(new NotFoundError('Карточка с указанным _id не найдена.'));
    }
    if (deletedCard.owner.toString() !== req.user._id.toString()) {
      return next(
        new UserRightsError('Недостаточно прав для удаления этой карточки')
      );
    }
    return res.send({ message: 'Карточка успешно удалена.' });
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные при удалении карточки.'
          )
        );
      default:
        return next(new InternalServerError('Ошибка сервера'));
    }
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      return res.send({ message: 'Лайк добавлен' });
    }
    return next(new NotFoundError('Передан несуществующий _id карточки.'));
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка.'
          )
        );
      default:
        return next(new InternalServerError('Ошибка сервера'));
    }
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      return res.send({ message: 'Лайк удален' });
    }
    return next(new NotFoundError('Передан несуществующий _id карточки.'));
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка.'
          )
        );
      default:
        return next(new InternalServerError('Ошибка сервера'));
    }
  }
};

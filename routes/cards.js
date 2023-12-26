const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  createCardValidate,
  cardIdValidate,
} = require('../middlewares/validation');

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidate, createCard);
cardRouter.delete('/:cardId', cardIdValidate, deleteCard);

cardRouter.put('/:cardId/likes', cardIdValidate, likeCard);
cardRouter.delete('/:cardId/likes', cardIdValidate, dislikeCard);

module.exports = cardRouter;

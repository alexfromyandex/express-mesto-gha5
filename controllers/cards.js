const Card = require("../models/card");

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//_____________________________________________________________________________________________________________________________________

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(201).json(card);
  } catch (error) {
    switch (error.name) {
      case "ValidationError":
        return res.status(400).json({
          message: "Переданы некорректные данные при создании карточки.",
        });
      default:
        return res.status(500).send({ message: error.message });
    }
  }
};

//_____________________________________________________________________________________________________________________________________

module.exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.cardId);
    if (deletedCard) {
      return res.status(200).send({ message: "Карточка успешно удалена." });
    } else {
      return res.status(404).send({ message: "Карточка с указанным _id не найдена." });
    }
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res
          .status(400)
          .send({
            message: "Переданы некорректные данные при удалении карточки.",
          }); //400
      default:
        return res.status(500).send({ message: error.message });
    }
  }
};

//_____________________________________________________________________________________________________________________________________

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      return res.status(200).send({ message: "Лайк добавлен" });
    } else {
      return res
        .status(404)
        .send({ message: "Передан несуществующий _id карточки." });
    }
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      default:
        return res.status(500).send({ message: error.message });
    }
  }
};

//_____________________________________________________________________________________________________________________________________

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      return res.status(200).send({ message: "Лайк удален" });
    } else {
      return res
        .status(404)
        .send({ message: "Передан несуществующий _id карточки." });
    }
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      default:
        return res.status(500).send({ message: error.message });
    }
  }
};

const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mydb');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.user = {
    _id: '657c27858d06a03d6047806f',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Неверно указан путь.' });
});

app.listen(PORT);

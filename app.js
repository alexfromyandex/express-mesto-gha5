const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { loginUser, createUser } = require('./controllers/users');

const {
  createUserValidate,
  loginValidate,
} = require('./middlewares/validation');

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mydb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/signin', loginValidate, loginUser);
app.post('/signup', createUserValidate, createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use(errors());

app.use(() => {
  throw new NotFoundError('Неверно указан путь.');
});

app.use((err, req, res, next) => {
  const { statusCode, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT);

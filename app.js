const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

const { PORT = 3000 } = process.env;
const app = express();

//___________________________________________________________________________

mongoose.connect("mongodb://127.0.0.1:27017/mydb");

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("Ошибка подключения к MongoDB:", error);
});
db.once("open", () => {
  console.log("Успешное подключение к базе данных mydb");
});

//___________________________________________________________________________

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.user = {
    _id: "657c27858d06a03d6047806f",
  };
  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: "Неверно указан путь." });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

const userRouter = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);

userRouter.patch('/me/', updateUserData);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;

const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');
const {
  updateUserValidate,
  updateAvatarValidate,
  userIdValidate,
} = require('../middlewares/validation');

userRouter.get('/', getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get('/:userId', userIdValidate, getUserById);
userRouter.patch('/me', updateUserValidate, updateUserData);
userRouter.patch('/me/avatar', updateAvatarValidate, updateUserAvatar);

module.exports = userRouter;

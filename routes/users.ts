import express from 'express';
import User from '../models/User';
import mongoose from 'mongoose';
import auth, {RequestWithUser} from '../middleware/auth';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();

    return res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }

    next(e);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  const user = await User.findOne({username: req.body.username});

  if (!user) {
    return res.status(400).send({error: "Username or password are not correct!"});
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({error: "Username or password are not correct!"});
  }

  user.generateToken();
  await user.save();

  return res.send({message: "Username and password correct!", user});
});

usersRouter.get('/secret', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;

    res.send({message: 'Secret message', username: user?.username});
  } catch(e) {
    next(e);
  }
})

export default usersRouter;
import User from '../model/user.js';
import { StatusCodes } from 'http-status-codes';

const register = async (req, res) => {
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};

const login = (req, res) => {
  res.send('login');
};

const updateUser = (req, res) => {
  res.send('Update user');
};

export { register, login, updateUser };

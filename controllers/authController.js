import User from '../model/user.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const userAlreadyExist = await User.findOne({ email });
  if (userAlreadyExist) {
    throw new BadRequestError('Email already in use!!!');
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastName: user.lastName,
    },
    token,
    location: user.location,
  });
};

const login = (req, res) => {
  res.send('login');
};

const updateUser = (req, res) => {
  res.send('Update user');
};

export { register, login, updateUser };

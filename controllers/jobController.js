import Job from '../model/Job.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPage: 1 });
};

const createJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company && !position) {
    throw new BadRequestError('Please provide all values');
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};
const showStats = async (req, res) => {
  res.send('show stats');
};
const deleteJob = async (req, res) => {
  res.send('delete job');
};
const updateJob = async (req, res) => {
  res.send('update job');
};

export { getAllJobs, createJob, showStats, deleteJob, updateJob };

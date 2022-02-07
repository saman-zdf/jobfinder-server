import Job from '../model/Job.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import checkPermission from '../utils/checkPermission.js';

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

// Update job
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position, jobLocation, jobType, status } = req.body;
  if (!company && !position) {
    throw new BadRequestError('Please provide all values');
  }
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  // console.log(typeof req.user.userId);
  // console.log(typeof job.createdBy);

  // check permission
  checkPermission(req.user, job.createdBy);

  // findOneAndUpdate does not trigger the hooks in the model if there is any, in this case job does not have any
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  // if there are any hooks in your model lie user model you need to use findOne for update and attach all the data from req.body to the item you found in this case job, but if there is no hook in your model you can use findOneAndUpdate.
  // job.position = position;
  // job.company = company;
  // job.jobLocation = jobLocation;
  // job.status = status;
  // job.jobType = jobType;
  // await job.save();
  res.status(StatusCodes.OK).json({ updatedJob });
};

const showStats = async (req, res) => {
  res.send('show stats');
};

// delete job
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  // this is a alternative for deleting
  // const deletedJob = await Job.findOneAndRemove({_id: jobId})
  checkPermission(req.user, job.createdBy);

  await job.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed!' });
};

export { getAllJobs, createJob, showStats, deleteJob, updateJob };

import Job from '../model/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermission from '../utils/checkPermission.js';
import mongoose from 'mongoose';
import moment from 'moment';

// get all jobs
const getAllJobs = async (req, res) => {
  const { status, search, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  // add stuff based on condition.

  if (status !== 'all') {
    queryObject.status = status;
  }

  if (jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }
  // no await
  let result = Job.find(queryObject);
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  // chain sort condition
  const jobs = await result;

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPage: 1 });
};

// created job
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

// get job by stats
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    // first we find jobs where they match with current user
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    // then we group them with any property we have in our collection, in this case with status
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, cur) => {
    const { _id: title, count } = cur;
    acc[title] = count;
    return acc;
  }, {});
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplication = await Job.aggregate([
    // first we find jobs where they match with current user
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    // then we group them with year and month for our chart, _id will be the object which hold data of year and month, $year: '$createdAt' will give us the year, $month: '$createdAt' will give us the month
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        // count will calculate the sum of jobs with $sum to give us how many job were created at that specific month
        count: { $sum: 1 },
      },
    },
    // with $sort we can sort the data to get the latest jobs
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    // $limit will make a limitation for months
    { $limit: 6 },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplication });
};

export { getAllJobs, createJob, showStats, deleteJob, updateJob };

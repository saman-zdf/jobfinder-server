const getAllJobs = (req, res) => {
  res.send('Get All Jobs');
};
const createJob = (req, res) => {
  res.send('create job');
};
const showStats = (req, res) => {
  res.send('show stats');
};
const deleteJob = (req, res) => {
  res.send('delete job');
};
const updateJob = (req, res) => {
  res.send('update job');
};

export { getAllJobs, createJob, showStats, deleteJob, updateJob };

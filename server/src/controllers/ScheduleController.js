import scheduleServices from '../services/scheduleServices';

const ScheduleController = {
  read: (req, res) => {
    scheduleServices.read(req, req.user.emails[0].value)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

  create: (req, res) => {
    scheduleServices.create(req.body, req.user.emails[0].value)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

  update: (req, res) => {
    scheduleServices.update(req.body, req.user.emails[0].value)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

  destroy: (req, res) => {
    res.send('Schedule destroy not implemented yet.');
  },

};

export default ScheduleController;

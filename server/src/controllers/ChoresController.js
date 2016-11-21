import choresServices from '../services/choresServices';

const ChoresController = {
  create: (req, res) => {
    choresServices.create(req.body, req.user.emails[0].value)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

  read: (req, res) => {
    res.send('Chores read is not implemented yet');
  },

  readAll: (req, res) => {
    res.send('Chores read all is not implemented yet');
  },

  update: (req, res) => {
    choresServices.update(req.body, req.user.emails[0].value)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

  destroy: (req, res) => {
    choresServices.destroy(req.body, req.user.emails[0].value)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

  readOneChildsChores: (req, res) => {
    // console.log('REQ PARAMS: ', req.user.emails[0].value);
    choresServices.readOneChildsChores(req.body, req.user.emails[0].value)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

};

export default ChoresController;

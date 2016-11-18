import childrenServices from '../services/childrenServices';

const ChildrenController = {

  addChild: (req, res) => {
    childrenServices.addChild(req.body, req.user.id)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

  updateChild: (req, res) => {
    childrenServices.updateChild(req.body, req.user.id)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

  deleteChild: (req, res) => {
    childrenServices.deleteChild(req.body, req.user.id)
    .then(status => res.send(status))
    .catch(err => res.status(500).send(err));
  },

};

export default ChildrenController;

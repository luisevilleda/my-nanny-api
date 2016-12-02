import ChoresController from './controllers/ChoresController';
import UserController from './controllers/UserController';
import ChildrenController from './controllers/ChildrenController';
import ScheduleController from './controllers/ScheduleController';

const routes = (app, passport) => {
  // Shorthand for gating routes
  const auth = () => passport.authenticate('amazon-token');

  /* /////// DOCS /////// */
  app.get('/', (req, res) => res.render('index', { title: 'my-nanny docs' }));

  /* /////// Alexa /////// */

  app.get('/api/alexa', auth(), UserController.getAlexaInfo);


  /* /////// ACCOUNT /////// */

  /**
  * @api {put} /api/account Update Account
  * @apiGroup Account
  *
  * @apiParamExample PUT format:
  *     {
  *       "account": {
  *         "username": "George",
  *         "timezone": "EST",
  *         "phone": "9990009999",
  *       }
  *     }
  *
  * @apiSuccess {String} Successfully updated account.
  *
  * @apiError Failed to update account.
  */
  app.put('/api/account', auth(), UserController.updateAccount);

  /**
  * @api {get} /api/account Get account info
  * @apiGroup Account
  *
  * @apiParamExample GET format:
  *      https://api.my-nanny.org/api/account?access_token=Atza%...
  *
  * @apiSuccessExample Success-Response:
  *
  *     {
  *       "account": {
  *         "username": "Mary",
  *         "timezone": "EST",
  *         "phone": "1234567890",
  *         "email": "mary@example.com"
  *       },
  *       "children": [
  *         {
  *           "id": 1,
  *           "name": "Winston",
  *           "phone": "9990008888"
  *         },
  *         {
  *           "id": 2,
  *           "name": "Wendy",
  *           "phone": "1112223333"
  *         }
  *       ]
  *     }
  *
  */
  app.get('/api/account', auth(), UserController.getInfo);

  /* /////// CHILDREN /////// */

  /**
  * @api {get} /api/children/:id Get all information for one child
  * @apiGroup Children
  * @apiParamExample GET format:
  *      https://api.my-nanny.org/api/children/:id?access_token= + amazon-token
  *
  * @apiSuccessExample Success-Response:
  *
  *   {
  *       "child": {
  *           "id": 1,
  *           "name": "Winston",
  *           "accountId": 1,
  *           "phone": "2125241324"
  *       }
  *   }
  *
  */
  app.get('/api/children/:id', auth(), ChildrenController.getChild);

  /* /////// CHILDREN /////// */

  /**
  * @api {get} /api/children Get all children associate with account
  * @apiGroup Children
  * @apiParamExample GET format:
  *      https://api.my-nanny.org/api/children?access_token= + amazon-token
  *
  * @apiSuccessExample Success-Response:
  *
  *   {
  *       "children": [
  *         {
  *           "id": 1,
  *           "name": "Winston",
  *           "photo": "http://image.com/",
  *           "accountId": 1,
  *           "phone": "2125241324"
  *           },
  *         {
  *           "id": 2,
  *           "name": "Wendy",
  *           "photo": null,
  *           "accountId": 1,
  *           "phone": "2129876543"
  *         }
  *       ]
  *   }
  *
  */
  app.get('/api/children', auth(), ChildrenController.getChildren);


  /* /////// CHILDREN /////// */

  /**
  * @api {post} /api/children Add Child to Account
  * @apiGroup Children
  *
  * @apiParamExample POST format:
  *
  *   {
  *       "child": {
  *         "name": "Winston",
  *         "phone": "8887776666"
  *       }
  *    }
  *
  * @apiSuccess {String} Successfully added child.
  *
  * @apiError Failed to add child.
  */
  app.post('/api/children', auth(), ChildrenController.addChild);

  /**
  * @api {put} /api/children Update a child
  * @apiGroup Children
  *
  * @apiParamExample PUT format:
  *     {
  *       "child": {
  *         "id": 3,
  *         "name": "Angus",
  *         "phone": "0009990000"
  *       }
  *     }
  *
  * @apiSuccess {String} Successfully updated child.
  *
  * @apiError Failed to update child.
  */
  app.put('/api/children', auth(), ChildrenController.updateChild);

  /**
  * @api {delete} /api/children Delete a child
  * @apiGroup Children
  *
  * @apiParamExample DELETE format:
  *     {
  *       "child": {
  *         "id": 3
  *       }
  *     }
  *
  * @apiSuccess {String} Successfully deleted child.
  *
  * @apiError Failed to update child.
  */
  app.delete('/api/children', auth(), ChildrenController.deleteChild);

  /* /////// CHORES /////// */

  /**
  * @api {get} /api/children/:id/chores?startDate=2016-04-15&endDate=2016-12-09&page=1
  * Get chores for a child
  * @apiGroup Chores
  *
  * @apiDescription Get today's chores,
  * startDate AND/OR endDate, page is optional, 10 results per request
  *
  * @apiSuccessExample Success-Response:
  *
  *           "chores": [
  *              {
  *                 "id": 1,
  *                 "title": "Clean your room",
  *                 "details": "Vaccuum too!",
  *                 "date": "2016-12-24",
  *                 "completed": false
  *              },
  *              {
  *                 "id": 2,
  *                 "title": "Feed the dog",
  *                 "details": "Don't leave the can open this time!",
  *                 "date": "2016-04-01",
  *                 "completed": true
  *              }
  *           ]
  *
  */
  app.get('/api/children/:id/chores', auth(), ChoresController.getChoresForDateRange);


  /**
  * @api {post} /api/chores Add Chores to a Child
  * @apiGroup Chores
  *
  * @apiParamExample POST format:
  *   {
  *       "child": {
  *         "id": 1
  *       },
  *       "chores": [
  *         {
  *           "title": "Clean your room",
  *           "details": "Please clean your room nice and neat. Vaccuum it too!",
  *           "date": "2016-12-24"
  *         },
  *         {
  *           "title": "Wash the dishes",
  *           "details": "Use the blue sponge under the sink.",
  *           "date": "2016-12-24"
  *         }
  *        ]
  *     }
  *
  * @apiSuccess {String} Successfully added chore.
  *
  * @apiError Failed to add chore.
  */
  app.post('/api/chores', auth(), ChoresController.create);

  /**
  * @api {put} /api/chores Update chore(s) for a child
  * @apiGroup Chores
  * @apiDescription Expects an array even if you are only updating 1 chore
  *
  * @apiParamExample PUT format:
  *
  *       "child": {
  *         "id": 1
  *       },
  *       "chores": [
  *         {
  *           "id": 1,
  *           "title": "Feed the dog",
  *           "details": "Don't leave the food bin open!",
  *           "date": "2016-12-31"
  *         }
  *        ]
  *     }
  *
  */
  app.put('/api/chores', auth(), ChoresController.update);

  /**
  * @api {delete} /api/chores Destroy a child's chore(s)
  * @apiGroup Chores
  *
  * @apiParamExample DELETE format:
  *
  *       "child": {
  *         "id": 1
  *       },
  *       "chores": [
  *         {
  *           "id": 1
  *         }
  *        ]
  *     }
  *
  */
  app.delete('/api/chores', auth(), ChoresController.destroy);


  /* /////// Schedule /////// */

  /**
  * @api {get} /api/children/:id/schedule Get schedule for a child
  * @apiGroup Schedule
  *
  * @apiSuccessExample Success-Response:
  *
  *   {
  *           "schedule": {
  *               "id": 1,
  *               "monday": "null",
  *               "tuesday": "12:30",
  *               "wednesday": "14:05",
  *               "thursday": "18:30",
  *               "friday": "14:00",
  *               "saturday": "09:30",
  *               "sunday": "null",
  *               "dateOfLastCheckin": "2016-06-19"
  *             }
  *
  *   }
  */
  app.get('/api/children/:id/schedule', auth(), ScheduleController.read);

  /**
  * @api {post} /api/schedule Create schedule for a child
  * @apiGroup Schedule
  *
  * @apiParamExample POST format:
  *     {
  *       "account": {
  *         "amazonId": "999888777666"
  *       },
  *       "child": {
  *         "id": "1"
  *       },
  *       "schedule": {
  *         "monday": "null",
  *         "tuesday": "12:30",
  *         "wednesday": "14:05",
  *         "thursday": "18:30",
  *         "friday": "14:00",
  *         "saturday": "09:30",
  *         "sunday": "null"
  *       }
  *     }
  *
  * @apiSuccess {String} Successfully added chore.
  *
  * @apiError Failed to add chore.
  */
  app.post('/api/schedule', auth(), ScheduleController.create);

  /**
  * @api {put} /api/schedule Update schedule for a child
  * @apiGroup Schedule
  */
  app.put('/api/schedule', auth(), ScheduleController.update);

  /**
  * @api {delete} /api/schedule Delete schedule for a child
  * @apiGroup Schedule
  *
  * @apiParamExample DELETE format:
  *     {
  *       "account": {
  *         "amazonId": "999888777666"
  *       },
  *       "child": {
  *         "id": "1"
  *       },
  *       "schedule": {
  *         "id": 1,
  *         "monday": "08:25",
  *         "tuesday": "02:40",
  *         "wednesday": "08:05",
  *         "thursday": "null",
  *         "friday": "17:00",
  *         "saturday": "09:30",
  *         "sunday": "21:55",
  *          "childId": 1
  *       }
  *     }
  *
  */
  app.delete('/api/schedule', auth(), ScheduleController.destroy);
};

export default routes;

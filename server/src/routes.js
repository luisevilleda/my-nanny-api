import ChoresController from './controllers/ChoresController';
import UserController from './controllers/UserController';
import ChildrenController from './controllers/ChildrenController';
import ScheduleController from './controllers/ScheduleController';

const routes = (app, passport) => {
  // Shorthand for gating routes
  const auth = () => passport.authenticate('amazon-token');

  /* /////// DOCS /////// */
  app.get('/', (req, res) => res.render('index', { title: 'my-nanny docs' }));

  /* /////// AUTH /////// */

  /**
  * @api {post} /logout Logout
  * @apiGroup Auth
  *
  *
  * @apiSuccess {String} Successfully logged out.
  *
  * @apiError Failed to log out.
  */
  app.post('/logout', UserController.logout);

  /* /////// ACCOUNT /////// */

  /**
  * @api {put} /api/account Update Account
  * @apiGroup Account
  *
  * @apiParamExample PUT format:
  *     {
  *       "account": {
  *         "amazonId": "999888777666",
  *         "username": "George",
  *         "timeZone": "EST",
  *         "phone": "9990009999",
  *         "email": "george@anotherExample.com"
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
  *      https://api.my-nanny.org/api/account?amazonId=999888777666
  *
  * @apiSuccessExample Success-Response:
  *
  *     {
  *       "account": {
  *         "id": 1,
  *         "token": "1234",
  *         "username": "Mary",
  *         "amazonId": "999888777666",
  *         "timeZone": "EST",
  *         "phone": "1234567890",
  *         "email": "mary@example.com"
  *       },
  *       "children": [
  *         {
  *           "id": 1,
  *           "name": "Winston",
  *           "accountId": 1,
  *           "schedule": {
  *             "id": 15,
  *             "dateOfLastCurfew": "2000-12-31",
  *             "sunday": "null",
  *             "monday": "null",
  *             "tuesday": "12:30",
  *             "wednesday": "14:05",
  *             "thursday": "18:30",
  *             "friday": "14:00",
  *             "saturday": "09:30",
  *             "sunday": "null",
  *             "childId": 1
  *           },
  *           "chores": [
  *             {
  *               "id":3,
  *               "title": "Clean your room",
  *               "details": "Please clean your room nice and neat. Vaccuum it too!",
  *               "date": "2016-12-24",
  *               "completed": false,
  *               "childId": 1
  *             },
  *             {
  *               "id":4,
  *               "title": "Wash the dishes",
  *               "details": "Use the blue sponge under the sink.",
  *               "date": "2016-12-24",
  *               "completed": true,
  *               "childId": 1
  *             }
  *           ],
  *         },
  *         {
  *           "id": 2,
  *           "name": "Wendy",
  *           "accountId": 1,
  *           "chores": [],
  *           "schedule": null
  *         }
  *       ]
  *     }
  *
  */
  app.get('/api/account', auth(), UserController.getInfo);

  /* /////// ACCOUNT /////// */

  /**
  * @api {get} /api/account/:id/children Get all children associate with account
  * @apiGroup Account
  * @apiParamExample GET format:
  *      https://api.my-nanny.org/api/account/:id/children/?access_token= + amazon-token
  *
  * @apiSuccessExample Success-Response:
  *
  *    {
  *       "account": {
  *         "id": 1
  *       },
  *       "children": [
  *         {
  *           "id": 1,
  *           "name": "Winston",
  *           "accountId": 1,
  *           "phone": "2125241324"
  *           },
  *         {
  *           "id": 2,
  *           "name": "Wendy",
  *           "accountId": 1,
  *           "phone": "2129876543"
  *         }
  *       ]
  *     }
  *
  *
  */
  app.get('/api/account/children', auth(), UserController.getChildren);

  /* /////// CHILDREN /////// */

  /**
  * @api {post} /api/children Add Child to Account
  * @apiGroup Children
  *
  * @apiParamExample POST format:
  *     {
  *       "account": {
  *         "amazonId": "999888777666"
  *       },
  *       "child": {
  *         "name": "Winston",
  *         "phone": "8887776666"
  *       }
  *     }
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
  *       "account": {
  *         "amazonId": "999888777666"
  *       },
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
  * @api {put} /api/children Delete a child
  * @apiGroup Children
  *
  * @apiParamExample DELETE format:
  *     {
  *       "account": {
  *         "amazonId": "999888777666"
  *       },
  *       "child": {
  *         "id": 3
  *       }
  *     }
  *
  * @apiSuccess {String} Successfully updated child.
  *
  * @apiError Failed to update child.
  */
  app.delete('/api/children', auth(), ChildrenController.deleteChild);

  /* /////// CHORES /////// */

  /**
  * @api {get} /api/children
  *
  *
  *
  *
  *
  */
  app.get('/api/children/:id/chores', auth(), ChoresController.readOneChildsChores);


  /**
  * @api {get} /api/chores Get all chores for a child
  * @apiGroup Chores
  *
  */
  app.get('/api/chores', auth(), ChoresController.readAll);

  /**
  * @api {get} /api/chores/:id Get a specific chore?
  * @apiGroup Chores
  *
  */
  app.get('/api/chores/:id', auth(), ChoresController.read);

  /**
  * @api {post} /api/chores Add Chores to a Child
  * @apiGroup Chores
  *
  * @apiParamExample POST format:
  *     {
  *       "account": {
  *         "amazonId": "999888777666"
  *       },
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
  * @apiDescription Expects an array even if you are on;y updating 1 chore
  *
  * @apiParamExample PUT format:
  *     {
  *       "account": {
  *         "amazonId": "999888777666"
  *       },
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
  *     {
  *       "account": {
  *         "amazonId": "999888777666"
  *       },
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
  * @api {get} /api/schedule Get schedule for a child
  * @apiGroup Schedule
  */
  app.get('/api/schedule', auth(), ScheduleController.read);

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

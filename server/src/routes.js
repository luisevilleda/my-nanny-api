import ChoresController from './controllers/ChoresController';
import UserController from './controllers/UserController';
import ChildrenController from './controllers/ChildrenController';
import ScheduleController from './controllers/ScheduleController';

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.sendStatus(401);
};

const routes = (app, passport) => {
  //TEST
  app.get('/test', ensureAuthenticated, (req, res) => {
    return res.sendStatus(200);
  });

  /* /////// DOCS /////// */
  app.get('/', (req, res) => res.render('index', { title: 'my-nanny docs' }));

  /* /////// AUTH /////// */

  app.get('/login',
          passport.authenticate('amazon', { scope: ['profile', 'postal_code'] }),
          (req, res) => {});

  app.get('/login/callback', 
          passport.authenticate('amazon', { failureRedirect: '/login' }),
          function(req, res) {
            res.redirect('/');
          });

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
  app.put('/api/account', UserController.updateAccount);

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
  app.get('/api/account', UserController.getInfo);

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
  app.post('/api/children', ChildrenController.addChild);

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
  app.put('/api/children', ChildrenController.updateChild);

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
  app.delete('/api/children', ChildrenController.deleteChild);


  /* /////// CHORES /////// */

  /**
  * @api {get} /api/chores Get all chores for a child
  * @apiGroup Chores
  *
  */
  app.get('/api/chores', ChoresController.readAll);

  /**
  * @api {get} /api/chores/:id Get a specific chore?
  * @apiGroup Chores
  *
  */
  app.get('/api/chores/:id', ChoresController.read);

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
  app.post('/api/chores', ChoresController.create);

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
  app.put('/api/chores', ChoresController.update);

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
  app.delete('/api/chores', ChoresController.destroy);


  /* /////// Schedule /////// */

  /**
  * @api {get} /api/schedule Get schedule for a child
  * @apiGroup Schedule
  */
  app.get('/api/schedule', ScheduleController.read);

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
  app.post('/api/schedule', ScheduleController.create);

  /**
  * @api {put} /api/schedule Update schedule for a child
  * @apiGroup Schedule
  */
  app.put('/api/schedule', ScheduleController.update);

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
  app.delete('/api/schedule', ScheduleController.destroy);
};

export default routes;

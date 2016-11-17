import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import passport from 'passport';
import AmazonTokenStrategy from 'passport-amazon-token';
// import { Strategy } from 'passport-amazon';
import routes from './routes';
import config from './config';

// These imports start the connection and model relationships
import connection from './connection';
import initializeSchemas from './initializeSchemas';

// PASSPORT
passport.use(new AmazonTokenStrategy(
  {
    clientID: config.amazonClientId,
    clientSecret: config.amazonClientSecret,
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, next) => {
    next(null, profile);
  }));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE']);
  next();
});


app.use(cookieParser());
app.use(session({ secret: 'my nanny is awesome' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'docs')));

routes(app, passport);

const port = process.env.devPort || config.port;
console.log(`server is listening on port ${port}`);

app.listen(port);

export default app;

export default {
  // Node Express
  port: 'FILL_ME_IN_WITH_A_NUMBER_REMOVE_QUOTES',

  // SQL credentials
  username: 'FILL_ME_IN',
  password: 'FILL_ME_IN',
  database: process.env.NODE_ENV === 'test' ? 'chaiTest' : 'FILL_ME_IN',
  env: 'dev',
  key: 'PATH_TO_KEY',
  crt: 'PATH_TO_CERTIFICATE',

  // AMAZON credentials
  amazonClientId: 'FILL_ME_IN',
  amazonClientSecret: 'FILL_ME_IN',

  redirectUrlAfterLogin: 'https://localhost:3000/',

  // Urls that are allowed in CORS
  CORSurl: 'http://localhost:3000',
};



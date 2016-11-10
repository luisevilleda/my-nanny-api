import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log('getting static files from ', __dirname + '/public');
app.use(express.static(__dirname + '/public'));

routes(app);

var port = process.env.devPort || 1337;
console.log('server is listening on port ' + port);

app.listen(port);

export default app;
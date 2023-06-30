const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const bodyParser = require('body-parser');
const compression = require('compression');

const { webServer } = require('@root/config');
const { WebApiServer } = require('osmium-webapi');
const Auth = require('./main/classes/Auth');
const LoaderCheck = require('./main/classes/LoaderCheck');

Auth.initialize(); 

const passport = Auth.Passport();

app.express = express();

app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({extended: true}));

const session = require('express-session')({secret:'dsafdsafdsfdsafdsa', resave: true, saveUninitialized: true});

app.express.use(session);

app.express.use(passport.initialize());
app.express.use(passport.session());

app.express.set('trust proxy', 1);
app.express.set('view engine', 'pug');
app.express.set('views', './src/frontend/views');
app.express.use(express.static(`./dist`));
app.express.use(compression());

app.webServer = new http.Server(app.express);

const ioServer = socketIo(app.webServer);
ioServer.use(require("express-socket.io-session")(session, {autoSave: true}));

// @ts-ignore
app.socketServer = new WebApiServer(ioServer);
require('@backend/middleware/packet')();

require('@backend/routes')();
Object.entries(require('@backend/events')).forEach(([key, method]) => {
  try {
    method();
    logger.info(`Подключен файл: '${key}'`);
  }
  catch {
    logger.error(`Ошибка подключения файла: '${key}'`);
  }
}); 

app.webServer.listen(webServer.port);
logger.info(`Веб-сервер на порту ${webServer.port} [ОК]`);

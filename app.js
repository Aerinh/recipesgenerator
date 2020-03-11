const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const path = require('path');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');

const app = express();
const server = http.Server(app)

const io = socketIO(server)
const port = 3001

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);

module.exports = app;

server.listen(port, () => console.log(`Listening on port ${port}`))

io.on('connection', socket => {
  console.log('User connected')

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})


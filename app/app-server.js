// app-server.js
import express from 'express'
import bodyParser from 'body-parser'
import hogan from 'hogan-express'
import compression from 'compression'
import session from 'express-session'
import es6Promise from 'es6-promise'
es6Promise.polyfill();
import 'isomorphic-fetch'

import config from '../config/private'

// Express
const app = express()
const one_day = 86400000
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/public/', { maxAge: one_day }))
app.set('port', (process.env.PORT || 3000))
app.use(compression())
app.use(session({
  secret: 'rechat and react rock!',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: false,
    maxAge: null
  }
}))
app.use(bodyParser.json({limit: '5mb'}))

// Socket.io
const http = require('http').Server(app)
const io = require('socket.io')(http)
io.on('connection', function(socket){
  socket.on('chat message', function(message){
    io.emit('chat message', message)
  })
})

// For dev port access
if(process.env.NODE_ENV === 'development'){
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:' + process.env.DEV_PORT)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
  })
}

// Routes
require('./routes')(app, config)

// Start app
http.listen(app.get('port'))
console.info('==> ✅  Server is listening in ' + process.env.NODE_ENV + ' mode');
console.info('==> 🌎  Go to http://localhost:%s', app.get('port'));
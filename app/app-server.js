// app-server.js
import express from 'express'
import bodyParser from 'body-parser'
import hogan from 'hogan-express'
import compression from 'compression'
import session from 'express-session'
import es6Promise from 'es6-promise'
es6Promise.polyfill();
import 'isomorphic-fetch'

import config from '../config'

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
app.use(bodyParser.json())

// Routes
require('./routes')(app, config)

// Start app
app.listen(app.get('port'))
console.info("==> ✅  Server is listening in production mode");
console.info("==> 🌎  Go to http://localhost:%s", app.get('port'));
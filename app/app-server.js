// app-server.js
import express from 'express'
import bodyParser from 'body-parser'
import hogan from 'hogan-express'
import compression from 'compression'
import session from 'express-session'

// Express
const app = express()
const one_day = 86400000
app.engine('html', hogan)
app.set('views', __dirname + '/public')
app.use('/dist', express.static(__dirname + '/public/dist', { maxAge: one_day }))
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

// Redirects
app.use((req, res, next) => {
  let path = req.path
  if(path.indexOf('dashboard') !== -1 && !req.session.user){
    return res.redirect('/signin?redirect_to=' + path)
  }
  next()
})

// Routes
require('./routes')(app)

// Start app
app.listen(app.get('port'))
console.info("==> ✅  Server is listening in production mode");
console.info("==> 🌎  Go to http://localhost:%s", app.get('port'));
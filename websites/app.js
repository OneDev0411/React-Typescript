// app.js
const express = require('express')
const hogan = require('hogan-express')
const compression = require('compression')

// Express
const app = express()
const one_day = 86400000
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/public/', { maxAge: one_day }))
app.set('port', (process.env.PORT || 3000))
app.use(compression())

app.get('/',(req, res) => {
  const title = 'test'
  res.locals.page = {
    title
  }
  res.render('index.html')
})

// Start app
app.listen(app.get('port'))
console.info('==> ✅  Server is listening in ' + process.env.NODE_ENV + ' mode');
console.info('==> 🌎  Go to http://localhost:%s', app.get('port'));
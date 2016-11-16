require('babel-core/register')({
  presets: ['react']
});
const express = require('express')
const React = require('react')
const request = require('request')
const ReactDOMServer = require('react-dom/server')
const app = express()
const hogan = require('hogan-express')
app.engine('html', hogan)
app.set('port', (process.env.PORT || 3000))
const Rechat = require('./rechat.js')
const options = {
  host: process.env.RECHAT_HOST,
  client_id: null,
  client_secret: null
}
const rechat = Rechat({
  client_id: process.env.RECHAT_CLIENT_ID,
  client_secret: process.env.RECHAT_CLIENT_SECRET,
  host: process.env.RECHAT_HOST
})
app.use((req, res, next) => {
  const host = req.headers['host']
  if (!host)
    res.end()
  const hostname = host.split(':')[0]
  rechat.website.getByHostname(hostname, (err, website) => {
    if (err) {
      console.log(err)
      res.statusCode = err.http
      res.json(err)
      return
    }
    res.locals.website = website
    next()
  })
})
app.use((req, res, next) => {
  app.set('views', __dirname + '/build/' + res.locals.website.template)
  express.static('./build/' + res.locals.website.template + '/assets')(req, res, next)
})
app.get('/', (req, res) => {
  const ReactApp = React.createFactory(require('./src/components/Templates/' + res.locals.website.template))
  const host = req.headers['host']
  if (!host)
    res.end()
  const hostname = host.split(':')[0]
  res.locals.website
  res.locals.content = ReactDOMServer.renderToString(ReactApp({ website: res.locals.website }))
  if (req.query.access_token && req.query.brand)
    res.locals.is_editable = true
  return res.render('index.html')
})

app.listen(app.get('port'))
console.info('==> ✅  Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> 🌎  Go to http://localhost:%s', app.get('port'))
const Rechat = require('./rechat.js')
const express = require('express')
const Template = require('./template.js')

const app = express()

const rechat = Rechat({
  client_id: process.env.RECHAT_CLIENT_ID,
  client_secret: process.env.RECHAT_CLIENT_SECRET,
  host: process.env.RECHAT_HOST
})

app.get('/templates.json', (req, res) => {
  Template.getAll((err, templates) => {
    if (err) {
      res.statusCode = err.http || 500
      res.error(err)
      return
    }

    res.json(templates)
  })
})

app.get('/templates/:name.js', (req, res) => {
  const template = req.params.name

  Template.compile(template, (err, compiled) => {
    if (err) {
      res.statusCode = 500
      res.json(err)
      return
    }

    res.end(compiled)
  })
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

    Template.getSchema(website.template, (err, template) => {
      if (err) {
        console.log(err)
        return res.end()
      }

      next()
    })
  })
})

app.use((req, res, next) => {
  express.static('templates/' + res.locals.website.template + '/assets')(req, res, next)
})

app.get('/', (req, res) => {
  Template.render(res.locals.website.template, res.locals, (err, html) => {
    if (err) {
      res.statusCode = 500
      res.json(err)
      return
    }

    res.end(html)
  })
})

app.listen(process.env.PORT || 3000)
const express = require('express')

const app = express()

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
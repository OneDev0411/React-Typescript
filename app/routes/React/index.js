// index.js
import React from 'react'
import { match, RoutingContext } from 'react-router'
import ReactDOMServer from 'react-dom/server'
import async from 'async'

// Store
import AppStore from '../../stores/AppStore'

// Config
import routes from './Config'

module.exports = (app, config) => {
  app.get('*',(req, res) => {
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      async.series([
        callback => {
          // Add marketing / server-side page content here
          require('../app/marketing')(app, config, req, res, callback)
        },
        callback => {
          delete AppStore.user
          // timestamp bundle
          const date = new Date
          res.locals.time = date.getTime()
          let reactMarkup = ReactDOMServer.renderToString(<RoutingContext data={ AppStore.data } {...renderProps} />)
          res.locals.reactMarkup = reactMarkup
          if (error) {
            res.status(500).send(error.message)
          } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
          } else if (renderProps) {
            // Success!
            res.status(200).render('index.html')
          } else {
            res.status(404).render('index.html')
          }
        },
      ]) // async.series
    })
  })
}
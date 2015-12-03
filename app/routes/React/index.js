// index.js
import React from 'react'
import { match, RoutingContext } from 'react-router'
import ReactDOMServer from 'react-dom/server'

// Store
import AppStore from '../../stores/AppStore'

// Config
import routes from './Config'

module.exports = (app, config) => {

  app.get('*',(req, res) => {

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      
      let reactMarkup = ReactDOMServer.renderToStaticMarkup(<RoutingContext data={AppStore.data} {...renderProps} />)
      
      res.locals.reactMarkup = reactMarkup

      console.log(reactMarkup)

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

    })
  })
  
}
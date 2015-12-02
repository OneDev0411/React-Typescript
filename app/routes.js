// routes.js
import React from 'react'
import { match, RoutingContext, Route, IndexRoute } from 'react-router'
import ReactDOMServer from 'react-dom/server'

// Store
import AppStore from './stores/AppStore'

// Config
import routes from './Routes.config'

module.exports = (app, config) => {

  /* API routes first
  ============================ */
  // Gets
  require('./api/gets/rooms')(app)

  // Posts
  require('./api/posts/signin')(app)
  require('./api/posts/forgot-password')(app)
  require('./api/posts/create-room')(app)

  app.get('/signout',(req, res) => {
    req.session.destroy()
    return res.redirect('/')
  })

  // React routes
  app.get('*',(req, res) => {

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      
      if(req.session.user){
        AppStore.data.user = req.session.user
        res.locals.AppStore = JSON.stringify(AppStore)
        return res.status(200).render('index.html')
      }

      let reactMarkup = ReactDOMServer.renderToStaticMarkup(<RoutingContext data={AppStore.data} {...renderProps} />)
      
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

    })
  })
}
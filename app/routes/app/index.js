// index.js

// Store
import AppStore from '../../stores/AppStore'

module.exports = (app, config) => {

  app.use((req, res, next) => {
    if(!req.session.user){
      delete AppStore.data.user
    }
    next()
  })

  app.get('/signout',(req, res) => {
    req.session.destroy()
    return res.redirect('/')
  })

  app.get('/terms/mls',(req, res) => {
    return res.render('terms.html')
  })

  app.get('/dashboard*', (req, res, next) => {
    if(req.session.user){
      AppStore.data.user = req.session.user
      res.locals.AppStore = JSON.stringify(AppStore)
      return res.status(200).render('index.html')
    } else {
      const path = req.path
      return res.redirect('/signin?redirect_to=' + path)
    }
    next()
  })

  app.get('/verify/email',(req, res) => {
    let AppStore = {}
    AppStore.data = {
      status: 'success'
    }
    if(req.query.status == 'error'){
      AppStore.data = {
        status: 'error'
      }
    }
    res.locals.AppStore = JSON.stringify(AppStore)
    return res.render('index.html')
  })
  
}
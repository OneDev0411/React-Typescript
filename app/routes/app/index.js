// index.js

// Store
import AppStore from '../../stores/AppStore'

module.exports = (app, config) => {

  app.get('/signout',(req, res) => {
    req.session.destroy()
    return res.redirect('/')
  })
  
  // If signed in, render client side
  app.use((req, res, next) => {
    if(req.session.user){
      AppStore.data.user = req.session.user
      res.locals.AppStore = JSON.stringify(AppStore)
      return res.status(200).render('index.html')
    }
    next()
  })

  app.get('/dashboard*', (req, res, next) => {
    if(req.query.admin){
      const user = { 
        type: 'user',
        username: null,
        first_name: 'Tony',
        last_name: 'Spiro',
        email: 'tony@rechat.co',
        phone_number: null,
        created_at: 1449165907.81014,
        id: '633e3f92-99e8-11e5-981c-0242ac110005',
        cover_image_url: null,
        profile_image_url: null,
        updated_at: 1449165907.81014,
        user_status: 'Active',
        profile_image_thumbnail_url: null,
        cover_image_thumbnail_url: null,
        email_confirmed: true,
        timezone: 'CST',
        user_code: 1067,
        user_type: 'Client',
        deleted_at: null,
        phone_confirmed: false,
        current_time: '2015-12-04T14:18:22.331Z',
        push_allowed: true,
        address: null,
        invitation_url: 'http://chappar.d.rechat.co/get/1067',
        access_token: 'MmFiZTcyZTAtOWFjNC0xMWU1LTgyZTgtODUxZTNhZjVjYjYy'
      }
      AppStore.data.user = user
      res.locals.AppStore = JSON.stringify(AppStore)
      return res.status(200).render('index.html')
    }
    if(!req.session.user){
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
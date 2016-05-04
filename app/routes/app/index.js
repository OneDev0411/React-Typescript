// index.js
import Room from '../../models/Room'
import Crypto from '../../models/Crypto'
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import Cosmic from 'cosmicjs'
import async from 'async'

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

  app.get('/terms',(req, res) => {
    Cosmic.getObject(config.cosmicjs, { slug: 'terms-of-service' }, (err, response) => {
      res.locals.title = response.object.title
      res.locals.content = response.object.content
      return res.render('templates/legal.html')
    })
  })

  app.get('/terms/mls',(req, res) => {
    Cosmic.getObject(config.cosmicjs, { slug: 'mls-terms' }, (err, response) => {
      res.locals.title = response.object.title
      res.locals.content = response.object.content
      return res.render('templates/legal.html')
    })
  })

  app.get('/privacy',(req, res) => {
    Cosmic.getObject(config.cosmicjs, { slug: 'privacy' }, (err, response) => {
      res.locals.title = response.object.title
      res.locals.content = response.object.content
      return res.render('templates/legal.html')
    })
  })

  // Seamless listing
  app.get('/dashboard/mls/:id', (req, res, next) => {
    AppStore.data.user = req.session.user
    res.locals.AppStore = JSON.stringify(AppStore)
    return res.status(200).render('index.html')
    res.end()
  })

  // Seamless chat
  app.get('/dashboard/recents/:id', (req, res, next) => {
    if (!req.query.token)
      return next()
    const decoded_token = decodeURIComponent(req.query.token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
    const id = decrypted_obj.id
    const tokens = decrypted_obj.tokens
    const access_token = tokens.access
    async.series([
      callback => {
        const params = {
          id,
          access_token
        }
        // Create user session
        User.get(params, (error, response) => {
          const user = response.data
          user.access_token = access_token
          req.session.user = user
          callback()
        })
      },
      callback => {
        return res.redirect('/dashboard/recents/' + req.params.id)
        res.end()
      }
    ])
  })

  app.get('/dashboard*', (req, res, next) => {
    if(req.session.user){
      AppStore.data.user = req.session.user
      AppStore.data.path = req.url
      AppStore.data.location = {
        pathname: req.url
      }
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

  app.get('/invite',(req, res) => {
    const room_id = req.query.room_id
    const invite_token = req.query.invite_token
    // If already signed in
    if(req.session.user){
      const user = req.session.user
      const add_user_params = {
        room_id: room_id,
        user: user.id,
        access_token: invite_token,
        api_host: config.app_url
      }
      Room.addUser(add_user_params, (err, response) => {
        if(err){
          return res.redirect('/?error=add-user-to-room')  
        }
        return res.redirect('/dashboard/recents/' + room_id)
      })
    } else {
      return res.redirect('/signin?message=invite-room&room_id=' + req.query.room_id + '&invite_token=' + req.query.invite_token)
    }
  })
}
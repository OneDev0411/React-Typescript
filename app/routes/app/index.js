// index.js
// Room
import Room from '../../models/Room'

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
      // timestamp bundle
      const date = new Date
      res.locals.time = date.getTime()
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

  app.get('/invite',(req, res) => {
    
    const room_id = req.query.room_id
    const invite_token = req.query.invite_token
    
    // If already signed in
    if(req.session.user){
      const user = req.session.user
      const add_user_params = {
        room_id: room_id,
        users: [user.id],
        access_token: invite_token,
        api_host: config.api_host
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
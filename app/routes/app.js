// app.js
module.exports = (app, config) => {

  app.get('dashboard/:slug', (req, res, next) => {
    const path = req.path
    // Session pages
    if(!req.session.user){
      return res.redirect('/signin?redirect_to=' + path)
    }
    next()
  })

  app.get('/signout',(req, res) => {
    req.session.destroy()
    return res.redirect('/')
  })
  
}
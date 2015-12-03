// index.js
module.exports = (app, config) => {

  app.get('/robots.txt', (req, res, next) => {
    res.type('text/plain')
    return res.send('User-agent: *\nDisallow: /')
  })

  app.get('/dashboard', (req, res) => {
    const path = req.path
    if(!req.session.user){
      return res.redirect('/signin?redirect_to=' + path)
    }
  })

  app.get('/dashboard/:slug', (req, res) => {
    const path = req.path
    if(!req.session.user){
      return res.redirect('/signin?redirect_to=' + path)
    }
  })

  app.get('/signout',(req, res) => {
    req.session.destroy()
    return res.redirect('/')
  })
  
}
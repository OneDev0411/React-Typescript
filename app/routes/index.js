// index.js
module.exports = (app, config) => {

  /* API routes first
  ============================ */
  require('./api')(app, config)

  /* App routes
  ============================ */
  require('./app')(app, config)
  require('./app/verify')(app, config)
  if (process.env.NODE_ENV === 'development')
    require('./app/tests')(app, config)

  /* React routes
  ============================ */
  require('./React')(app, config)

}
const request = require('request')

const options = {
  host: 'https://boer.d.rechat.com',
  client_id: null,
  client_secret: null
}

const configure = (o) => {
  Object.keys(o).forEach(name => {
    options[name] = o[name]
  })
  return rechat
}

const rechat = {}

const errors = {
  network: {
    http: 500,
    message: 'Network Error'
  }
}

rechat.website = {}

rechat.website.getByHostname = (hostname, cb) => {
  request({
    url: options.host + '/websites/search',
    qs: {
      hostname
    },
    json: true
  }, (err, res, body) => {
    if (err)
      return cb(errors.network)

    if (res.statusCode !== 200)
      return cb(body)

    cb(null, body.data)
  })
}


module.exports = configure
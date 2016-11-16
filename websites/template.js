require('node-jsx').install();
const fs = require('fs')
const babel = require('babel-core')
const basename = require('path').basename
const async = require('async')
const ReactDom = require('react-dom/server')

React = require('react')

const getSchema = (name, cb) => {
  fs.readFile(__dirname + '/templates/' + basename(name) + '/template.json', (err, buffer) => {
    if (err)
      return cb(err)

    try {
      const schema = JSON.parse(buffer.toString())
      cb(null, schema)
    } catch(e) {
      cb(e)
    }
  })
}

const render = (name, props, cb) => {
  const id = './templates/' + name + '/index.js'

  if (process.NODE_ENV !== 'production')
    delete require.cache[require.resolve(id)]

  var out
  try {
    const component = require(id)
    const el = component(props)
    out = ReactDom.renderToString(el)
  } catch(e) {
    return cb(e)
  }

  cb(null, out)
}

const getAll = cb => {
  fs.readdir('templates', (err, dirs) => {
    if (err)
      return cb(err)

    async.map(dirs, getSchema, cb)
  })
}

const compile = (name, cb) => {
  fs.readFile(__dirname + '/templates/' + basename(name) + '/index.js', (err, buffer) => {
    if (err)
      return cb(err)

    const options = {
      presets: [
        'react',
        'es2015'
      ]
    }

    const compiled = babel.transform(buffer.toString(), options).code
    cb(null, compiled)
  })
}

module.exports = {
  getSchema,
  render,
  getAll,
  compile
}
const _ = require('underscore')

const routes = {
}

_.each(routes, (group, name) => {
  _.each(group, (r) => {
    const item = {
      path: `./api/${name}/${r.path}`
    }

    if (typeof r.auth === 'undefined') {
      list.push(item)
    } else {
      list.unshift(item)
    }
  })
})

module.exports = list

import React from 'react'
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'
import AppStore from '../../../app/stores/AppStore'
import config from '../../../config/webpack'

async function display(file, renderProps = {}) {
  if (['production', 'staging'].indexOf(process.env.NODE_ENV) > -1) {
    if (/\/dashboard\/mls\/(\w+)/.test(this.request.url)) {
      await this.render('app', {
        data: this.locals,
        body: renderToString(
          <RouterContext
            data={AppStore.data}
            {...renderProps}
          />
        )
      })
    }
    else {
      await this.render(file || 'app',  { data: this.locals })
    }
  } else {
    await this.render('development', {
      data: this.locals,
      jsBundle: `${config.compile.publicPath}/${config.compile.jsBundle}`
    })
  }
}

module.exports = function() {
  return async function(ctx, next) {
    if (ctx.display) {
      return await next()
    }

    ctx.display = display.bind(ctx)
    await next()
  }
}

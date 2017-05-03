import React from 'react'
import xss from 'xss'
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducers from '../../../app/reducers'
import config from '../../../config/webpack'

async function display(file, renderProps = {}) {

  const initialState = {
    data: this.locals.AppStore ? this.locals.AppStore.data : {}
  }

  // create store
  const store = createStore(reducers, initialState, compose(applyMiddleware(thunk)))

  // get store initial data
  const store_data = encodeURIComponent(xss(JSON.stringify(store.getState())))

  if (['production', 'staging'].indexOf(process.env.NODE_ENV) > -1) {
    if (/\/dashboard\/mls\/(\w+)/.test(this.request.url)) {
      await this.render('app', {
        store_data,
        body: renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        )
      })
    }
    else {
      await this.render(file || 'app',  {
        data: this.locals,
        store_data
      })
    }
  } else {
    await this.render('development', {
      store_data,
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

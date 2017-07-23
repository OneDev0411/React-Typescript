import React from 'react'
import xss from 'xss'
import urlParser from 'url'
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import Brand from '../../../app/models/Brand'
import reducers from '../../../app/reducers'
import config from '../../../config/webpack'

function fetch(renderProps, store) {
  return renderProps.components.map(c => {
    if (c && c.fetchData) {
      return c.fetchData(store.dispatch, renderProps.params)
    }
    return Promise.reslove
  })
}

async function getBrand(user, url) {
  return new Promise((resolve, reject) => {
    const hostname = urlParser.parse(url).hostname

    Brand.getByHostname({ hostname, user }, (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

async function display(file, renderProps) {
  let initialState = {
    data: this.locals.AppStore ? this.locals.AppStore.data : {}
  }

  try {
    const response = await getBrand(this.session.user, this.request.origin)
    initialState = {
      ...initialState,
      ...{
        data: {
          ...initialState.data,
          ...{ brand: response.body.data }
        }
      }
    }
  } catch (e) {
    /* nothing */
  }

  // create store
  const store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(thunk))
  )

  // append user data to render props params
  if (initialState.data.user) {
    renderProps.params.user = initialState.data.user
  }

  try {
    await Promise.all(fetch(renderProps, store))
  } catch (e) {
    /* do nothing */
  }

  // get store initial data
  const store_data = encodeURIComponent(xss(JSON.stringify(store.getState())))

  if (['production', 'stage'].indexOf(process.env.NODE_ENV) > -1) {
    await this.render(file || 'app', {
      data: this.locals,
      store_data
    })

    // if (/\/dashboard\/mls\/(\w+)/.test(this.request.url)) {
    //   await this.render('app', {
    //     store_data,
    //     data: this.locals,
    //     body: renderToString(
    //       <Provider store={store}>
    //         <RouterContext {...renderProps} />
    //       </Provider>
    //     )
    //   })
    // }
    // else {
    //   await this.render(file,  {
    //     data: this.locals,
    //     store_data
    //   })
    // }
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
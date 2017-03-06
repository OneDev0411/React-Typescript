import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import AppStore from '../../../app/stores/AppStore'
import routes from '../../../app/routes'
import config from '../../../config/webpack'

function matcher(location) {
  return new Promise((resolve) => {
    match({ routes, location }, (error, redirectLocation, renderProps) =>
      resolve({ error, redirectLocation, renderProps }))
  })
}

function fetch(renderProps, store) {
  return renderProps.components.map((c) => {
    if (c && c.fetchData) { return c.fetchData(store.dispatch, renderProps.params) }
    return Promise.reslove
  })
}

export default async function (ctx) {
  const { error, redirectLocation, renderProps } = await matcher(ctx.request.url)

  if (error) {
    ctx.status = 500
    ctx.body = error.message
  } else if (redirectLocation) {
    ctx.status = 302
    ctx.redirect(redirectLocation.pathname + redirectLocation.search)
  }
  else if (renderProps) {

    try {
      await Promise.all(fetch(renderProps, store))
    } catch (e) {
      /* do nothing */
    }

    if (process.env.NODE_ENV === 'production') {
      await ctx.render('app', {
        title: 'App',
        store: xss(JSON.stringify(store.getState())),
        body: renderToString(
          <RouterContext
            data={AppStore.data}
            {...renderProps}
          />
        )
      })
    } else {
      await ctx.render('development', {
        title: '_DEV_',
        jsBundle: `${config.compile.publicPath}/${config.compile.jsBundle}`
      })
    }
  } else {
    ctx.status = 404
    ctx.body = 'Not found!'
  }
}

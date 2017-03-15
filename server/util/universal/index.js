import React from 'react'
import { match } from 'react-router'
import routes from '../../../app/routes'
import config from '../../../config/webpack'

function matcher(location) {
  return new Promise((resolve) => {
    match({ routes, location }, (error, redirectLocation, renderProps) =>
      resolve({ error, redirectLocation, renderProps }))
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
    await ctx.display(null, renderProps)
  } else {
    ctx.status = 404
    ctx.body = 'Not found!'
  }
}

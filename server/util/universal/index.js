import { match } from 'react-router'

import routes from '../../../app/routes'

function matcher(location) {
  return new Promise(resolve => {
    match({ routes, location }, (error, redirectLocation, renderProps) =>
      resolve({ error, redirectLocation, renderProps })
    )
  })
}

export default async function(ctx) {
  const { error, redirectLocation, renderProps } = await matcher(
    ctx.request.url
  )

  if (error) {
    ctx.status = 500
    ctx.body = error.message
  } else if (redirectLocation) {
    ctx.status = 302
    ctx.redirect(redirectLocation.pathname + redirectLocation.search)
  } else if (renderProps) {
    console.log('Univeral-Middleware:::Start')

    const file = ctx.render_file || 'app'

    await ctx.display(file, renderProps)
    console.log('Univeral-Middleware:::End')
  } else {
    ctx.status = 404
    ctx.body = 'Not found!'
  }
}

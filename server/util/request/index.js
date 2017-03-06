import Koa from 'koa'
import superagent from 'superagent'
import config from '../../../config/private'

const app = new Koa()

const request = async function (ctx, next) {

  ctx.config = config
  const api_url = config.api.url
  const access_token = ctx.request.query.access_token
  const app_name = config.app_name
  const user_agent = ctx.headers['user-agent']
  const host_name = ctx.request.query.hostname

  const agent = superagent

  ctx.fetch = function(url, method = 'get') {

    const headers = {
      'x-real-agent': user_agent,
      'User-Agent': app_name,
      'Content-Type': 'application/json'
    }

    if (access_token) {
      headers.authorization = `Bearer ${access_token}`
    }

    if (host_name != null) {
      url = `${url}?hostname=${host_name}`
    }

    console.log(`${api_url}${url}`)

    return agent[method.toLowerCase()](`${api_url}${url}`)
      .set(headers)
      .on('error', err => {
        let responseText = err.response.text

        // try to parse encoded json
        try {
          responseText = JSON.parse(responseText)
        }
        catch(e) {}

        ctx.status = err.response.status
        ctx.body = {
          status: 'error',
          response: {
            status: err.response.status,
            text: responseText
          }
        }
      })
      .on('response', response => {
        if (~~response.status === 200) {
          response.body.status = 'success'
        }
      })
  }

  await next()
}

module.exports = app.use(request)

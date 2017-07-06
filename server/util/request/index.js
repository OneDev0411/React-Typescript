import Koa from 'koa'
import superagent from 'superagent'
import request from 'request'
import colors from 'colors'
import config from '../../../config/private'

function logger(url, method, headers, ctx) {
  const api_url = config.api.url
  const { user } = ctx.session
  const endpoint = `${method.toUpperCase()} ${api_url}${url}`.green
  const username = user ? user.email : 'GUEST'
  let text = `[ ${colors.gray.bold(username)} ] ${endpoint}`

  if (user) {
    text += ` (${user.access_token})`.yellow
  }

  text += "\n" + (JSON.stringify(headers)).cyan
  text += "\n"

  console.log(text)
}

const requestMiddleware = async function (ctx, next) {
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

    // log
    logger(url, method, headers, ctx)

    try {
      return agent[method.toLowerCase()](`${api_url}${url}`)
      .set(headers)
      .on('error', err => {
        let responseText = err.response ? err.response.text : err.message

        // try to parse encoded json
        try {
          responseText = JSON.parse(responseText)
        } catch(e) {}

        const status = err.response ? err.response.status : 500

        if (status === 490)
          return false

        ctx.status = status
        ctx.body = {
          status: 'error',
          response: {
            status: err.response ? err.response.status : 'Internal server error',
            text: responseText
          }
        }
      })
      .on('response', response => {
        if (~~response.status >= 200 && ~~response.status <= 207) {
          response.body.status = 'success'
        }
      })
    }
    catch(e) {
      console.log(e)
      throw e
    }
  }

  /**
  * stream file
  */
  ctx.stream = async function(url) {
    const download = request({
      url: `${api_url}${url}`,
      headers: {
        authorization: `Bearer ${access_token}`
      }
    })

    // log
    console.log(`[ + ] Stream ${url}`)

    return new Promise(resolve => {
      return resolve(download)
    })
  }

  await next()
}

export default function() {
  return requestMiddleware
}

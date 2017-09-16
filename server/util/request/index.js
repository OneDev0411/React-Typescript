import Koa from 'koa'
import colors from 'colors'
import request from 'request'
import superagent from 'superagent'
import config from '../../../config/private'

function logger(url, method, headers, ctx) {
  const { user } = ctx.session
  const api_url = config.api.url
  const username = user ? user.email : 'GUEST'
  const endpoint = `${method.toUpperCase()} ${api_url}${url}`.green

  let text = `[ ${colors.white.bold(username)} ] ${endpoint}`
  if (user) {
    text += ` (${user.access_token})`.yellow
  }
  text += `\n${JSON.stringify(headers).cyan}`
  text += '\n'

  console.log(text)
}

const requestMiddleware = async (ctx, next) => {
  ctx.config = config
  const api_url = config.api.url
  const app_name = config.app_name
  const access_token = ctx.request.query.access_token
  const user_agent = ctx.headers['user-agent']
  const host_name = ctx.request.query.hostname

  ctx.fetch = (url, method = 'get', contentType = 'application/json') => {
    const headers = {
      'User-Agent': app_name,
      'x-real-agent': user_agent,
      'Content-Type': contentType
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
      return superagent
        [method.toLowerCase()](`${api_url}${url}`)
        .set(headers)
        .on('error', err => {
          let responseText = err.response ? err.response.text : err.message
          console.log('[ Fetch Error ] ', responseText)

          // try to parse encoded json
          try {
            responseText = JSON.parse(responseText)
          } catch (error) {
            console.log(error)
          }

          const status = err.response ? err.response.status : 500

          if (status === 490) {
            return false
          }

          ctx.status = status
          ctx.body = {
            status: 'error',
            response: {
              status: err.response
                ? err.response.status
                : 'Internal server error',
              text: responseText
            }
          }
        })
        .on('response', response => {
          if (~~response.status >= 200 && ~~response.status <= 207) {
            try {
              response.body.status = 'success'
            } catch(e) {
              // nothing
            }
          }
        })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /**
  * stream file
  */
  ctx.stream = async url => {
    const download = request({
      url: `${api_url}${url}`,
      headers: {
        authorization: `Bearer ${access_token}`
      }
    })

    // log
    console.log(`[ + ] Stream ${url}`)

    return new Promise(resolve => resolve(download))
  }

  await next()
}

export default function () {
  return requestMiddleware
}

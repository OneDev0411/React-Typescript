import colors from 'colors'
import superagent from 'superagent'
import _ from 'underscore'

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

  ctx.log(text)
}

const requestMiddleware = async (ctx, next) => {
  ctx.config = config

  const api_url = config.api.url
  const { app_name } = config
  const { access_token: accessToken } = ctx.request.query
  const userAgent = ctx.headers['user-agent']
  const hostName = ctx.request.query.hostname

  ctx.fetch = (url, method = 'get', contentType = 'application/json') => {
    ctx.log('Fetch Start')

    const headers = {
      'User-Agent': app_name,
      'Content-Type': contentType
    }

    if (userAgent) {
      headers['x-real-agent'] = userAgent
    }

    if (accessToken) {
      headers.authorization = `Bearer ${accessToken}`
    }

    if (hostName != null) {
      url = `${url}?hostname=${hostName}`
    }

    // log
    logger(url, method, headers, ctx)

    return superagent[method.toLowerCase()](`${api_url}${url}`)
      .set(headers)
      .on('error', err => {
        let responseText = err.response ? err.response.text : err.message

        ctx.log(`[ Fetch Error: ${url} ] `, responseText)

        // try to parse encoded json
        try {
          responseText = JSON.parse(responseText)
        } catch (error) {
          ctx.log('Fetch -> Error -> JSON PARSE')
          ctx.log(error)
        }

        const status = err.response ? err.response.status : 500

        if (status === 490) {
          ctx.log('Fetch - 490 Error')
        } else {
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
        }
      })
      .on('response', response => {
        if (~~response.status >= 200 && ~~response.status <= 207) {
          try {
            // because server use streaming technique for uploading endpoints
            // and it happens because of 30s issue on heroku servers
            // btw I will kill @emilsedgh before 2020
            if (_.isEmpty(response.body)) {
              response.body = JSON.parse(response.text)
            }

            response.body = {
              ...response.body,
              status: 'success'
            }
          } catch (error) {
            ctx.log('Fetch -> Response -> Error', error)
            ctx.log(error)
          }
        }

        return response
      })
  }

  return next()
}

export default function() {
  return requestMiddleware
}

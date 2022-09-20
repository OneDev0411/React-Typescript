import os from 'os'
import path from 'path'

import compress from 'compression'
import history from 'connect-history-api-fallback'
import timeout from 'connect-timeout'
import cookieSession from 'cookie-session'
import express, { Request, Response, NextFunction } from 'express'
import enforce from 'express-sslify'
import morgan from 'morgan'
import serveStatic from 'serve-static'
import throng from 'throng'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'

import { checkBrowser } from './app/middlewares/check-browser'
import { checkOFACEmbargo } from './app/middlewares/check-ofac-embargo'
import { userCookie } from './app/middlewares/user-cookie'
import appConfig from './config'
import routes from './routes'

const port = process.env.PORT || 8080
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

const app = express()

app.use(timeout('30s'))
app.use(compress())

app.use(
  cookieSession({
    name: 'rechat-webapp:session',
    keys: ['r3ch4t@re4ct_rocks!!!'],
    maxAge: 365 * 86400 * 1000, // one year
    secure: isProduction
  })
)

app.use(morgan('combined'))

/**
 * Checks OFAC embargo to restricting access from sanctioned countries
 */
if (isProduction) {
  app.use(checkOFACEmbargo)
}

/**
 * Checks user-agent and navigates old browsers to
 * the /unsupported page
 */
app.use(checkBrowser)

/**
 * creates user cookie that includes ip address
 */
app.use(userCookie)

/**
 * caches properties liting urls in order to provide open graph for social networks
 */
if (isProduction) {
  app.use(
    require('prerender-node')
      .whitelisted('/dashboard/mls/.*')
      .set('prerenderToken', appConfig.prerender_token)
  )
}

// setup routes
app.use('/', routes)
app.use(haltOnTimedout)

app.use(history())

if (isDevelopment) {
  const config = require('../webpack/development')
  const compiler = webpack(config)

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  )
  app.use(require('webpack-hot-middleware')(compiler))

  app.use('/static', express.static(path.resolve(__dirname, '../app/static')))
}

if (isProduction) {
  app.set('trust proxy', 1)
  app.disable('x-powered-by')
  app.use(enforce.HTTPS())

  const setHeaders = (res: Response, path: string) => {
    // prevent caching of index.html
    if (serveStatic.mime.lookup(path) === 'text/html') {
      res.setHeader('Surrogate-Control', 'no-store')
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      )
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
    }
  }

  app.use(
    '/',
    serveStatic(path.resolve(__dirname, '../dist'), {
      maxAge: '7d',
      setHeaders
    })
  )
}

function haltOnTimedout(
  req: Request & {
    timedout: boolean
  },
  res: Response,
  next: NextFunction
) {
  if (req.timedout) {
    console.error(`[ Timeout ] ${req.method}\t ${req.url}`)
  }

  next()
}

throng({
  workers: isDevelopment
    ? 1
    : process.env.WEB_CONCURRENCY || Math.max(os.cpus().length, 8) || 1,
  lifetime: Infinity,
  start: () => {
    app.listen(port, () => console.log(`App is started on 0.0.0.0:${port}`))
  }
})

import path from 'path'
import os from 'os'

import throng from 'throng'
import express, { Request, Response, NextFunction } from 'express'
import compress from 'compression'
import cookieSession from 'cookie-session'
import enforce from 'express-sslify'
import timeout from 'connect-timeout'

import webpack from 'webpack'
import history from 'connect-history-api-fallback'
import webpackDevMiddleware from 'webpack-dev-middleware'

import { checkBrowser } from './app/middlewares/check-browser'

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

/**
 * Checks user-agent and navigates old browsers to
 * the /unsupported page
 */
app.use(checkBrowser)

// setup routes
app.use('/', routes)
app.use(haltOnTimedout)

app.use(history())

if (isDevelopment) {
  const config = require('../webpack/development').default
  const compiler = webpack(config)

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  )
  app.use('/static', express.static(path.resolve(__dirname, '../app/static')))
}

if (isProduction) {
  app.set('trust proxy', 1)
  app.disable('x-powered-by')
  app.use(enforce.HTTPS())

  app.use(
    '/',
    express.static(path.resolve(__dirname, '../dist'), {
      maxAge: '7d'
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

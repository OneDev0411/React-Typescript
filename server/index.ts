import path from 'path'

import express from 'express'
import compress from 'compression'
import cookieSession from 'cookie-session'
import enforce from 'express-sslify'
import bodyParser from 'body-parser'

import webpack from 'webpack'
import history from 'connect-history-api-fallback'
import webpackDevMiddleware from 'webpack-dev-middleware'

import proxifierRoute from './app/routes/proxifier'
import userProfileRoute from './app/routes/user/profile'
import usersLookupRoute from './app/routes/user/user-lookup'
import usersOAuthTokenRoute from './app/routes/user/oauth-token'
import signupRoute from './app/routes/user/signup'
import dealDocusignLoginRoute from './app/routes/deal/docusign-login'
import dealEnvelopeEditRoute from './app/routes/deal/envelope-edit'
import dealEnvelopeSignRoute from './app/routes/deal/envelope-sign'
import dealExportRoute from './app/routes/deal/export'
import dealReportRoute from './app/routes/deal/report'
import contactsExportOutlookRoute from './app/routes/contacts/export-outlook'
import livebyReportRoute from './app/routes/liveby/report'
import livebyNeighborhoodsRoute from './app/routes/liveby/neighborhoods'
import myMarketingMattersPunchoutRoute from './app/routes/my-marketing-matters/punchout'
import openHouseRoute from './app/routes/openhouse/registration'
import getPdfSizeRoute from './app/routes/get-pdf-size'
import refreshUserTokenRoute from './app/routes/refresh-token'
import corsRoute from './app/routes/cors'
import renderMjmlRoute from './app/routes/render-mjml'
import urlMetadataRoute from './app/routes/url-metadata'

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

const app = express()
const port = process.env.PROXY_PORT || 8080

const requestLimit = bodyParser.json({
  limit: '10mb'
})

if (isProduction) {
  app.set('trust proxy', 1)
  app.disable('x-powered-by')
  app.use(enforce.HTTPS())
}

app.use(
  cookieSession({
    name: 'rechat-webapp:session',
    keys: ['r3ch4r0Ks!!!'],
    maxAge: 365 * 86400 * 1000,
    secure: isProduction
  })
)

/**
 * deals routes.
 */
app.post('/api/proxifier', bodyParser.json(), proxifierRoute)

/**
 * user routes.
 */
app.get('/api/users/profile', userProfileRoute)
app.post('/api/users/lookup', bodyParser.json(), usersLookupRoute)
app.post('/api/oauth2/token', bodyParser.json(), usersOAuthTokenRoute)
app.post('/api/users', bodyParser.json(), signupRoute)

/**
 * deals routes.
 */
app.get('/api/deals/docusign/login', dealDocusignLoginRoute)
app.get('/api/deals/envelope/:id/edit', dealEnvelopeEditRoute)
app.get('/api/deals/envelope/:id/sign/:recipient', dealEnvelopeSignRoute)
app.get('/api/deals/export/:brand', dealExportRoute)
app.get('/api/deals/report/:data', dealReportRoute)

/**
 * contacts routes.
 */
app.post(
  '/api/contacts/export/outlook/:brand',
  bodyParser.json(),
  contactsExportOutlookRoute
)

/**
 * liveby routes.
 */
app.post('/api/liveby/report', requestLimit, livebyReportRoute)
app.post('/api/liveby/neighborhoods', requestLimit, livebyNeighborhoodsRoute)

/**
 * my marketing matters routes.
 */
app.post(
  '/api/my-marketing-matters/punchout',
  requestLimit,
  myMarketingMattersPunchoutRoute
)

/**
 * open house routes.
 */
app.post('/openhouse/:id/:brand/register', openHouseRoute)

/**
 * utility routes
 */
app.get('/api/utils/cors/:url(.+)', corsRoute)
app.post('/api/pdf/get-size', getPdfSizeRoute)
app.post('/api/user/refresh-token', refreshUserTokenRoute)
app.post('/api/utils/render-mjml', requestLimit, renderMjmlRoute)
app.post('/api/utils/get-url-metadata', requestLimit, urlMetadataRoute)

if (isDevelopment) {
  const config = require('../webpack/development').default
  const compiler = webpack(config)

  app.use(history())
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  )

  app.use('/static', express.static(path.resolve(__dirname, '../app/static')))
}

if (isProduction) {
  app.use(history())
  app.use(compress())

  app.use(
    '/',
    express.static(path.resolve(__dirname, '../dist'), {
      maxAge: '7d'
    })
  )
}

app.listen(port, () => console.log(`App is started on 0.0.0.0:${port}`))

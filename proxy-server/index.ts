import express from 'express'
import cookieSession from 'cookie-session'
import enforce from 'express-sslify'

import catchAllRoute from './app/routes/catchall'
import unsupportedRoute from './app/routes/unsupported'

import dealDocusignLoginRoute from './app/routes/deal/docusign-login'

const app = express()
const port = process.env.PROXY_PORT || 8080
const isProduction = process.env.NODE_ENV === 'production'

app.use(
  cookieSession({
    name: 'rechat-webapp:session',
    keys: ['r3ch4t@re4ct_rocks2020!!!'],
    maxAge: 365 * 86400 * 1000 // 1 year
  })
)

if (isProduction) {
  // This module enforces HTTPS connections on any incoming GET and HEAD requests. In case of a non-encrypted HTTP request, express-sslify automatically redirects to an HTTPS address using a 301 permanent redirect. Any other type of request (e.g., POST) will fail with a 403 error message.
  app.use(enforce.HTTPS())
}

/**
 * app routes.
 */
app.get('/', catchAllRoute)
app.get('/unsupported', unsupportedRoute)

app.get('/deals/docusign/login', dealDocusignLoginRoute)

app.listen(port, () => console.log(`App is started on 0.0.0.0:${port}`))

import express from 'express'

import catchAllRoute from './app/routes/catchall'
import unsupportedRoute from './app/routes/unsupported'

import dealDocusignLoginRoute from './app/routes/deal/docusign-login'

const app = express()
const port = process.env.PROXY_PORT || 8080

/**
 * app routes.
 */
app.get('/', catchAllRoute)
app.get('/unsupported', unsupportedRoute)

app.get('/deals/docusign/login', dealDocusignLoginRoute)

app.listen(port, () => console.log(`App is started on 0.0.0.0:${port}`))

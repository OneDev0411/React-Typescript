import express from 'express'
import bodyParser from 'body-parser'

import proxifierRoute from './app/routes/proxifier'
import userProfileRoute from './app/routes/user/profile'
import usersLookupRoute from './app/routes/user/user-lookup'
import usersOAuthTokenRoute from './app/routes/user/oauth-token'
import signupRoute from './app/routes/user/signup'
import signoutRoute from './app/routes/user/signout'
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
import unsupportedRoute from './app/routes/unsupported'

const router = express.Router()

const requestLimit = bodyParser.json({
  limit: '10mb'
})

/**
 * deals routes.
 */
router.post('/api/proxifier', bodyParser.json(), proxifierRoute)

/**
 * user routes.
 */
router.get('/api/users/profile', userProfileRoute)
router.post('/api/users/lookup', bodyParser.json(), usersLookupRoute)
router.post('/api/oauth2/token', bodyParser.json(), usersOAuthTokenRoute)
router.post('/api/users', bodyParser.json(), signupRoute)
router.get('/signout', bodyParser.json(), signoutRoute)

/**
 * deals routes.
 */
router.get('/api/deals/docusign/login', dealDocusignLoginRoute)
router.get('/api/deals/envelope/:id/edit', dealEnvelopeEditRoute)
router.get('/api/deals/envelope/:id/sign/:recipient', dealEnvelopeSignRoute)
router.get('/api/deals/export/:brand', dealExportRoute)
router.get('/api/deals/report/:data', dealReportRoute)

/**
 * contacts routes.
 */
router.post(
  '/api/contacts/export/outlook/:brand',
  requestLimit,
  contactsExportOutlookRoute
)

/**
 * liveby routes.
 */
router.post('/api/liveby/report', requestLimit, livebyReportRoute)
router.post('/api/liveby/neighborhoods', requestLimit, livebyNeighborhoodsRoute)

/**
 * my marketing matters routes.
 */
router.post(
  '/api/my-marketing-matters/punchout',
  requestLimit,
  myMarketingMattersPunchoutRoute
)

/**
 * open house routes.
 */
router.post('/openhouse/:id/:brand/register', openHouseRoute)

/**
 * utility routes
 */
router.get('/unsupported', unsupportedRoute)
router.get('/api/utils/cors/:url(.+)', corsRoute)
router.post('/api/pdf/get-size', requestLimit, getPdfSizeRoute)
router.post('/api/user/refresh-token', requestLimit, refreshUserTokenRoute)
router.post('/api/utils/render-mjml', requestLimit, renderMjmlRoute)
router.post('/api/utils/get-url-metadata', requestLimit, urlMetadataRoute)

export default router

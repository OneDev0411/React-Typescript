import bodyParser from 'body-parser'
import express from 'express'

import branchLinkRoute from './app/routes/branch-link'
import contactsExportOutlookRoute from './app/routes/contacts/export-outlook'
import corsRoute from './app/routes/cors'
import dealDocusignLoginRoute from './app/routes/deal/docusign-login'
import dealEnvelopeEditRoute from './app/routes/deal/envelope-edit'
import dealEnvelopeSignRoute from './app/routes/deal/envelope-sign'
import dealExportRoute from './app/routes/deal/export'
import dealReportRoute from './app/routes/deal/report'
import facebookAuthResultRoute from './app/routes/facebook-auth-result'
import facebookLoginRoute from './app/routes/facebook-login'
import getPdfSizeRoute from './app/routes/get-pdf-size'
import livebyNeighborhoodsRoute from './app/routes/liveby/neighborhoods'
import livebyReportRoute from './app/routes/liveby/report'
import myMarketingMattersPunchoutRoute from './app/routes/my-marketing-matters/punchout'
import openHouseRoute from './app/routes/openhouse/registration'
import proxifierRoute from './app/routes/proxifier'
import renderMjmlRoute from './app/routes/render-mjml'
import rssFeedsRoute from './app/routes/rss-feeds'
import unsupportedRoute from './app/routes/unsupported'
import urlMetadataRoute from './app/routes/url-metadata'
import usersOAuthTokenRoute from './app/routes/user/oauth-token'
import userProfileRoute from './app/routes/user/profile'
import resetPasswordRoute from './app/routes/user/reset-password'
import signoutRoute from './app/routes/user/signout'
import signupRoute from './app/routes/user/signup'
import usersLookupRoute from './app/routes/user/user-lookup'
import getVideoGifRoute from './app/routes/video/get-video-gif'
import getVideoboltVideosRoute from './app/routes/videobolt/get-videobolt-videos'
import getYoutubeVideoGifRoute from './app/routes/youtube/get-youtube-video-gif'

const router = express.Router()

const requestLimit = bodyParser.json({
  limit: '10mb'
})

/**
 * deals routes.
 */
router.post('/api/proxifier', requestLimit, proxifierRoute)

/**
 * user routes.
 */
router.get('/api/users/profile', userProfileRoute)
router.post('/api/users/lookup', bodyParser.json(), usersLookupRoute)
router.post('/api/oauth2/token', bodyParser.json(), usersOAuthTokenRoute)
router.post('/api/users', bodyParser.json(), signupRoute)
router.get('/reset_password', bodyParser.json(), resetPasswordRoute)
router.post('/api/users/signout', bodyParser.json(), signoutRoute)

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
router.get('/openhouse/:id/:brand/register', openHouseRoute)

/**
 * branch-link route.
 */
router.post(
  '/api/branch/link/*',
  bodyParser.urlencoded({
    limit: '10mb'
  }),
  branchLinkRoute
)

/**
 * facebook routes.
 */
router.get('/api/facebook/auth-result', facebookAuthResultRoute)
router.get('/api/facebook/login', facebookLoginRoute)

/**
 * utility routes
 */
router.get('/unsupported', unsupportedRoute)
router.get('/api/utils/cors/:url', corsRoute)
router.post('/api/pdf/get-size', requestLimit, getPdfSizeRoute)
router.post('/api/utils/render-mjml', requestLimit, renderMjmlRoute)
router.post('/api/utils/get-url-metadata', requestLimit, urlMetadataRoute)
router.post(
  '/api/utils/get-youtube-video-gif',
  bodyParser.json(),
  getYoutubeVideoGifRoute
)

router.post(
  '/api/utils/get-videobolt-videos',
  bodyParser.json(),
  getVideoboltVideosRoute
)

router.post('/api/utils/get-video-gif', bodyParser.json(), getVideoGifRoute)

router.post('/api/utils/rss-feeds', requestLimit, rssFeedsRoute)

export default router

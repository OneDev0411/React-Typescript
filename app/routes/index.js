import React from 'react'
import { IndexRoute, Route } from 'react-router'

import GoToDashboard from '../views/components/GoToDashboard'

// Containers
import AppLayout from '../components/App'
// Pages
import Load from '../loader'
import store from '../stores'
import UserIsNotAuthenticated from './userIsNotAuthenticated'

const AsyncAuthenticationLayout = Load({
  loader: () =>
    import('./components/Authentication' /* webpackChunkName: "authlay" */)
})

/* ==================================== */
//  Auth
/* ==================================== */

const AsyncBranch = Load({
  loader: () =>
    import('../components/Pages/Branch' /* webpackChunkName: "branch" */)
})

const AsyncSignUp = Load({
  loader: () =>
    import('../components/Pages/Auth/SignUp' /* webpackChunkName: "signup" */)
})

const AsyncRegister = Load({
  loader: () =>
    import('../components/Pages/Auth/Register' /* webpackChunkName: "register" */)
})

const AsyncSignIn = Load({
  loader: () =>
    import('../components/Pages/Auth/SignIn' /* webpackChunkName: "signin" */)
})

const AsyncVerifyRequest = Load({
  loader: () =>
    import('../components/Pages/Verify/Request' /* webpackChunkName: "request_verify" */)
})

const AsyncVerifyConfirm = Load({
  loader: () =>
    import('../components/Pages/Verify/Confirm' /* webpackChunkName: "confirm_verify" */)
})

const AsyncForgotPassword = Load({
  loader: () =>
    import('../components/Pages/Auth/Password/Forgot' /* webpackChunkName: "forgot_password" */)
})

const AsyncResetPassword = Load({
  loader: () =>
    import('../components/Pages/Auth/Password/Reset' /* webpackChunkName: "reset_password" */)
})

/* ==================================== */
//  MLS
/* ==================================== */

const AsyncListingsLayout = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Listings' /* webpackChunkName: "listings" */)
})

const AsyncListingsSearch = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Listings/Search' /* webpackChunkName: "listing_search" */)
})
// import ListingsSearch from '../components/Pages/Dashboard/Listings/Search'

const AsyncMlsSavedSearch = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Listings/SavedSearch' /* webpackChunkName: "alerts" */)
})

const AsyncListingsFavorites = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Listings/Favorites' /* webpackChunkName: "fav" */)
})

const AsyncListingSinglePage = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Listings/Listing' /* webpackChunkName: "list_single" */)
})

/* ==================================== */
//  Deals
/* ==================================== */

const AsyncDealsLayout = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals' /* webpackChunkName: "deal_i" */)
})

const AsyncDealCreate = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/create/create-deal' /* webpackChunkName: "deal_c" */)
})

const AsyncDealCreateOffer = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/create/create-offer' /* webpackChunkName: "deal_co" */)
})

const AsyncDealsList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/List' /* webpackChunkName: "deal_l" */)
})

const AsyncDealDashboard = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/Dashboard' /* webpackChunkName: "deal_d" */)
})

const AsyncDealFileViewer = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/FileViewer' /* webpackChunkName: "deal_fv" */)
})

const AsyncDealFormEdit = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/FormEdit' /* webpackChunkName: "deal_fe" */)
})

const AsyncAgentNetwork = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/AgentNetwork' /* webpackChunkName: "agent-network" */)
})

/* ==================================== */
//  Calendar
/* ==================================== */

const AsyncCalendar = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Calendar' /* webpackChunkName: "calendar" */)
})

/* ==================================== */
//  Contacts
/* ==================================== */

const AsyncContacts = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Contacts' /* webpackChunkName: "contact" */)
})

const AsyncContactProfile = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Contacts/Profile' /* webpackChunkName: "contact_p" */)
})

const AsyncContactsImportCsv = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Contacts/ImportCsv' /* webpackChunkName: "contact_csv" */)
})

/* ==================================== */
//  CRM FLOWS
/* ==================================== */

const AsyncFlowsList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Flows/List' /* webpackChunkName: "flow_list" */)
})

const AsyncFlowEdit = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Flows/Edit' /* webpackChunkName: "flow_edit" */)
})

/* ==================================== */
//  CRM Open Houses
/* ==================================== */

const AsyncOpenHousesList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/OpenHouse/List/OpenHousesList' /* webpackChunkName: "oh_list" */)
})

/* ==================================== */
//  CRM Tours List
/* ==================================== */

const AsyncToursList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Tours/List/ToursList' /* webpackChunkName: "tours_list" */)
})

/* ==================================== */
//  Marketing Center
/* ==================================== */

const AsyncMarketing = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Marketing' /* webpackChunkName: "marketing" */)
})

const AsyncMarketingTemplates = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Marketing/Templates' /* webpackChunkName: "marketing_templates" */)
})

const AsyncMarketingHistory = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Marketing/History' /* webpackChunkName: "marketing_history" */)
})

/* ==================================== */
//  Insights
/* ==================================== */

const AsyncMarketingInsightsList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/MarketingInsights/List' /* webpackChunkName: "marketing_insights_list" */)
})

const AsyncMarketingInsight = Load({
  loader: () =>
    import('../components/Pages/Dashboard/MarketingInsights/Insight' /* webpackChunkName: "email_insight" */)
})

/* ==================================== */
//  Chatroom
/* ==================================== */

const AsyncRecents = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Chatroom' /* webpackChunkName: "chat" */)
})

// Notifications
const AsyncNotificationsPage = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Notifications' /* webpackChunkName: "notif_p" */)
})

/* ==================================== */
//  Account settings
/* ==================================== */

const AsyncAccountLayout = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account' /* webpackChunkName: "account_layout" */)
})

const AsyncProfile = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/Profile' /* webpackChunkName: "profile" */)
})

const ExportCalendar = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/ICalIntegration' /* webpackChunkName: "deal_templates" */)
})

const ManageTags = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/ManageTags' /* webpackChunkName: "manage_tags" */)
})

const ReminderNotifications = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/ReminderNotifications' /* webpackChunkName: "reminder_notifications" */)
})

const EmailSignature = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/EmailSignature' /* webpackChunkName: "email_signature" */)
})

const EmailTemplatesSettings = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/EmailTemplates/EmailTemplatesSettings' /* webpackChunkName: "email_templates" */)
})

const ConnectedAccounts = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/ConnectedAccounts' /* webpackChunkName: "connected_accounts" */)
})

const AsyncUpgradeAccount = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/Upgrade' /* webpackChunkName: "upgrade" */)
})

const AsyncCSS = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/CentralizedShowingService' /* webpackChunkName: "centralized_showing_service" */)
})

/* ==================================== */
//  Widgets
/* ==================================== */

const WidgetsContainer = Load({
  loader: () =>
    import('../components/Pages/Widgets' /* webpackChunkName: "widgets_container" */)
})
const AsyncListingsWidget = Load({
  loader: () =>
    import('../components/Pages/Widgets/Listings' /* webpackChunkName: "listing_w" */)
})

const AsyncMapWidget = Load({
  loader: () =>
    import('../components/Pages/Widgets/Map' /* webpackChunkName: "map_w" */)
})

const AsyncSearchWidget = Load({
  loader: () =>
    import('../components/Pages/Widgets/Search' /* webpackChunkName: "search_w" */)
})

/* ==================================== */
//  Websites
/* ==================================== */

const AsyncWebsitesList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Websites/List' /* webpackChunkName: "websites_list" */)
})

/* ==================================== */
//  Other Pages
/* ==================================== */

const AsyncShare = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Marketing/SharePage' /* webpackChunkName: "mc_share_page" */)
})

const AsyncTeams = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Teams' /* webpackChunkName: "teams" */)
})

const AsyncChecklists = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Checklists' /* webpackChunkName: "console_checklists" */)
})

const AsyncWebsite = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Website' /* webpackChunkName: "website" */)
})

const AsyncForms = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Forms' /* webpackChunkName: "form" */)
})

const AsyncMobile = Load({
  loader: () =>
    import('../components/Pages/Mobile' /* webpackChunkName: "mobile" */)
})

const Async404 = Load({
  loader: () => import('../components/Pages/404' /* webpackChunkName: "404" */)
})

const AsyncOops = Load({
  loader: () =>
    import('../components/Pages/Oops' /* webpackChunkName: "Oops" */)
})

function authenticate(nextState, replace) {
  const { user } = store.getState()
  const isLoggedIn = user && user.access_token

  const noAuthList = ['/dashboard/mls', '/dashboard/mls/:id']

  if (nextState.routes.some(route => noAuthList.includes(route.path))) {
    return true
  }

  if (typeof window !== 'undefined' && !isLoggedIn) {
    replace({
      pathname: '/signin',
      state: { redirectTo: nextState.location.pathname }
    })
  }
}

export default (
  <Route>
    <Route path="/">
      <IndexRoute component={GoToDashboard} />} />
      <Route path="/dashboard" component={GoToDashboard} />
    </Route>

    <Route path="/" component={AsyncAuthenticationLayout}>
      <Route path="/branch" component={AsyncBranch} />
      <Route path="/share" component={AsyncShare} />

      <Route
        path="register"
        component={UserIsNotAuthenticated(AsyncRegister)}
      />

      <Route path="/signin" component={UserIsNotAuthenticated(AsyncSignIn)} />
      <Route path="/signup" component={UserIsNotAuthenticated(AsyncSignUp)} />

      <Route
        path="/verify/confirm/:verifyType"
        component={AsyncVerifyConfirm}
      />
      <Route
        path="/verify/request/:verifyType"
        component={AsyncVerifyRequest}
      />

      <Route
        path="/password/forgot"
        component={UserIsNotAuthenticated(AsyncForgotPassword)}
      />
      <Route path="/password/reset" component={AsyncResetPassword} />

      <Route path="/mobile" component={AsyncMobile} />

      <Route path="/wdigets" component={WidgetsContainer}>
        <Route path="/widgets/map" component={AsyncMapWidget} />
        <Route path="/widgets/search" component={AsyncSearchWidget} />
        <Route path="/widgets/listings" component={AsyncListingsWidget} />
      </Route>
    </Route>

    <Route path="/" component={AppLayout}>
      <Route path="dashboard/mls" component={AsyncListingsLayout}>
        <IndexRoute component={AsyncListingsSearch} />
      </Route>
    </Route>

    <Route path="/" component={AppLayout} onEnter={authenticate}>
      <Route path="/branch" component={AsyncBranch} />
      <Route path="/share" component={AsyncShare} />

      <Route path="/dashboard/calendar" component={AsyncCalendar} />

      <Route path="dashboard/mls" component={AsyncListingsLayout}>
        <IndexRoute component={AsyncListingsSearch} />
        <Route path="following" component={AsyncListingsFavorites} />
        <Route path="saved-searches/:id" component={AsyncMlsSavedSearch} />
      </Route>

      <Route path="/dashboard/mls/:id" component={AsyncListingSinglePage} />

      <Route component={AsyncContacts} path="/dashboard/contacts" />
      <Route path="/dashboard/contacts/:id" component={AsyncContactProfile} />
      <Route
        path="/dashboard/contacts/import/csv"
        component={AsyncContactsImportCsv}
      />

      <Route
        path="/dashboard/deals(/filter/:filter)"
        component={AsyncDealsLayout}
      >
        <IndexRoute component={AsyncDealsList} />
        <Route
          path="/dashboard/deals/create(/:id)"
          component={AsyncDealCreate}
        />
        <Route
          path="/dashboard/deals/:id/form-edit/:taskId"
          component={AsyncDealFormEdit}
        />
        <Route
          path="/dashboard/deals/:id/create-offer"
          component={AsyncDealCreateOffer}
        />
        <Route
          path="/dashboard/deals/:id/view/:taskId(/:entityType/:entityId)"
          component={AsyncDealFileViewer}
        />
        <Route
          path="/dashboard/deals/:id/marketing/network"
          component={AsyncAgentNetwork}
        />
        <Route
          path="/dashboard/deals/:id(/:tab)"
          component={AsyncDealDashboard}
        />
      </Route>

      <Route path="/dashboard/recents(/:roomId)">
        <IndexRoute component={AsyncRecents} />
      </Route>

      <Route
        path="/dashboard/notifications(/:type/:id)"
        component={AsyncNotificationsPage}
      />

      <Route path="/dashboard/tours" component={AsyncToursList} />
      <Route path="/dashboard/open-house" component={AsyncOpenHousesList} />

      <Route path="/dashboard/marketing" component={AsyncMarketing}>
        <IndexRoute component={AsyncMarketingHistory} />
        <Route component={AsyncMarketingTemplates} path=":types(/:medium)" />
      </Route>

      <Route path="/dashboard/insights">
        <IndexRoute component={AsyncMarketingInsightsList} />
        <Route path="scheduled" component={AsyncMarketingInsightsList} />
        <Route path=":id" component={AsyncMarketingInsight} />
      </Route>

      <Route path="dashboard/account" component={AsyncAccountLayout}>
        <IndexRoute component={AsyncProfile} />
        <Route path="upgrade" component={AsyncUpgradeAccount} />

        <Route path="exportCalendar" component={ExportCalendar} />
        <Route path="manage-tags" component={ManageTags} />
        <Route
          path="reminder-notifications"
          component={ReminderNotifications}
        />
        <Route path="email-signature" component={EmailSignature} />
        <Route path="email-templates" component={EmailTemplatesSettings} />
        <Route path="connected-accounts" component={ConnectedAccounts} />
        <Route path="css" component={AsyncCSS} />

        <Route path="flows" component={AsyncFlowsList} />
        <Route path="flows/:id" component={AsyncFlowEdit} />
      </Route>

      <Route path="/dashboard/teams(/:id)">
        <IndexRoute component={AsyncTeams} />
      </Route>

      <Route path="/dashboard/checklists">
        <IndexRoute component={AsyncChecklists} />
      </Route>

      <Route path="/dashboard/websites">
        <IndexRoute component={AsyncWebsitesList} />
      </Route>

      <Route path="/dashboard/website" component={AsyncWebsite} />
      <Route path="/dashboard/forms" component={AsyncForms} />
    </Route>

    <Route path="/oops" component={AsyncOops} />
    <Route path="*" component={Async404} />
  </Route>
)

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { batchActions } from 'redux-batched-actions'
import store from '../stores'
import Load from '../loader'
import UserIsNotAuthenticated from './userIsNotAuthenticated'

// actions
import { getDeals, getContexts } from '../store_actions/deals'

// utils
import { hasUserAccess } from '../utils/user-teams'

// Containers
import AppLayout from '../components/App'

const AsyncAuthenticationLayout = Load({
  loader: () =>
    import('./components/Authentication' /* webpackChunkName: "authlay" */)
})

// Pages
import Landing from '../components/Pages/Landing'

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

const AsyncListingsAlerts = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Listings/Alerts' /* webpackChunkName: "alerts" */)
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
    import('../components/Pages/Dashboard/Deals' /* webpackChunkName: "deal_i" */),
  fetchData: async (dispatch, params) => {
    const { user } = params

    if (!user) {
      return Promise.resolve()
    }

    return batchActions([
      await dispatch(getContexts(user)),
      await dispatch(getDeals(user, hasUserAccess(user, 'BackOffice')))
    ])
  }
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
    import('../components/Pages/Dashboard/Deals/list' /* webpackChunkName: "deal_l" */)
})

const AsyncDealDashboard = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/dashboard' /* webpackChunkName: "deal_d" */)
})

const AsyncDealFileManager = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/file-manager' /* webpackChunkName: "deal_fm" */)
})

const AsyncDealFormViewer = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/form-viewer' /* webpackChunkName: "deal_fv" */)
})

const AsyncDealFormEdit = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/form-edit' /* webpackChunkName: "deal_fe" */)
})
/* ==================================== */
//  Contacts
/* ==================================== */

const AsyncContacts = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Contacts' /* webpackChunkName: "contact" */)
})

const AsyncContactsList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Contacts/List' /* webpackChunkName: "contact_l" */)
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
//  CRM Tasks
/* ==================================== */

const AsyncCrmTasksList = Load({
  loader: () =>
    import('../views/CRM/Tasks' /* webpackChunkName: "ctm_tasks_list" */)
})

const AsyncCrmTask = Load({
  loader: () =>
    import('../views/CRM/Tasks/TaskPage' /* webpackChunkName: "ctm_task_page" */)
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

const AsyncPayment = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/Payment' /* webpackChunkName: "payment" */)
})

const AsyncUpgradeAccount = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Account/Upgrade' /* webpackChunkName: "upgrade" */)
})

/* ==================================== */
//  Widgets
/* ==================================== */

const WidgetsContainer = Load({
  loader: () =>
    import('../components/Pages/Widgets/' /* webpackChunkName: "widgets_container" */)
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
//  Other Pages
/* ==================================== */

const AsyncBrands = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Brand/index' /* webpackChunkName: "brand_settings" */)
})

const AsyncChecklistBrand = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Brand/Checklists' /* webpackChunkName: "brandChecklist" */)
})

const AsyncRoleBrand = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Brand/Roles' /* webpackChunkName: "brandRole" */)
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

const AsyncNoMatch = Load({
  loader: () =>
    import('../components/Pages/NoMatch' /* webpackChunkName: "404" */)
})

const AsyncOops = Load({
  loader: () =>
    import('../components/Pages/Oops' /* webpackChunkName: "Oops" */)
})

function authenticate(nextState, replace) {
  const { user } = store.getState()
  const isLoggedIn = user && user.access_token

  const noAuthList = [
    '/branch',
    '/dashboard/mls',
    '/dashboard/mls/:id',
    '/widgets/map',
    '/widgets/search',
    '/widgets/listings'
  ]

  for (let url of noAuthList) {
    for (let route of nextState.routes) {
      if (route.path && route.path !== '/' && route.path === url) {
        return true
      }
    }
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
    <Route path="/" component={AsyncAuthenticationLayout}>
      <IndexRoute component={Landing} />
      <Route path="/branch" component={AsyncBranch} />

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

      <Route path="dashboard/mls" component={AsyncListingsLayout}>
        <IndexRoute component={AsyncListingsSearch} />

        <Route path="actives" component={AsyncListingsFavorites} />
        <Route path="alerts" component={AsyncListingsAlerts}>
          <Route path=":alertId" component={AsyncListingsAlerts} />
        </Route>
      </Route>

      <Route path="/dashboard/mls/:id" component={AsyncListingSinglePage} />

      <Route path="/dashboard/contacts" component={AsyncContacts}>
        <IndexRoute component={AsyncContactsList} />
        <Route path="/dashboard/contacts/:id" component={AsyncContactProfile} />
        <Route
          path="/dashboard/contacts/import/csv"
          component={AsyncContactsImportCsv}
        />
      </Route>

      <Route path="/crm/tasks/:id" component={AsyncCrmTask} />
      <Route path="/crm/tasks" component={AsyncCrmTasksList} />

      <Route
        path="/dashboard/deals(/filter/:filter)"
        component={AsyncDealsLayout}
      >
        <IndexRoute component={AsyncDealsList} />
        <Route path="/dashboard/deals/create" component={AsyncDealCreate} />
        <Route path="/dashboard/deals/:id" component={AsyncDealDashboard} />
        <Route
          path="/dashboard/deals/:id/files"
          component={AsyncDealFileManager}
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
          path="/dashboard/deals/:dealId/form-viewer/:taskId(/:type/:objectId)"
          component={AsyncDealFormViewer}
        />
      </Route>

      <Route path="/dashboard/recents(/:roomId)">
        <IndexRoute component={AsyncRecents} />
      </Route>

      <Route
        path="/dashboard/notifications"
        component={AsyncNotificationsPage}
      />

      <Route path="dashboard/account" component={AsyncAccountLayout}>
        <IndexRoute component={AsyncProfile} />
        <Route path="upgrade" component={AsyncUpgradeAccount} />
      </Route>

      <Route path="/dashboard/brands">
        <IndexRoute component={AsyncBrands} />
        <Route
          path="/dashboard/brands/checklist/:brand"
          component={AsyncChecklistBrand}
        />
        <Route
          path="/dashboard/brands/role/:brand"
          component={AsyncRoleBrand}
        />
      </Route>

      <Route path="/dashboard/website" component={AsyncWebsite} />
      <Route path="/dashboard/forms" component={AsyncForms} />
    </Route>

    <Route path="/oops" component={AsyncOops} />
    <Route path="*" component={AsyncNoMatch} />
  </Route>
)

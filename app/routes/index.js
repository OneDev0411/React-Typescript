import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import store from '../stores'
import Load from '../loader'
import UserIsNotAuthenticated from './userIsNotAuthenticated'

// actions
import { getDeals } from '../store_actions/deals'
import { getContacts } from '../store_actions/contact'

// Containers
import AppLayout from '../components/App'

const AsyncAuthenticationLayout = Load({
  loader: () =>
    import('../components/Authentication' /* webpackChunkName: "authlay" */)
})

// Pages
import Landing from '../components/Pages/Landing'
import Brand from '../components/Pages/Dashboard/Brand'

const AsyncSignUp = Load({
  loader: () =>
    import('../components/Pages/Auth/SignUp' /* webpackChunkName: "signup" */)
})

const AsyncRegister = Load({
  loader: () =>
    import('../components/Pages/Auth/Register' /* webpackChunkName: "register" */)
})

const AsyncUpgradeAccount = Load({
  loader: () =>
    import('../components/Pages/Account/Upgrade' /* webpackChunkName: "upgrade" */)
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

const AsyncConfirmAgent = Load({
  loader: () =>
    import('../components/Pages/SignUp/ConfirmAgent' /* webpackChunkName: "confirm" */)
})

const AsyncNoMatch = Load({
  loader: () =>
    import('../components/Pages/NoMatch' /* webpackChunkName: "404" */)
})

const AsyncOops = Load({
  loader: () =>
    import('../components/Pages/Oops' /* webpackChunkName: "Oops" */)
})

const AsyncBranch = Load({
  loader: () =>
    import('../components/Pages/Branch' /* webpackChunkName: "branch" */)
})

const AsyncSettings = Load({
  loader: () =>
    import('../components/Pages/Account/Settings' /* webpackChunkName: "setting" */)
})

const AsyncNotifications = Load({
  loader: () =>
    import('../components/Pages/Account/Notifications' /* webpackChunkName: "notif" */)
})

// listings
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

// deals
const AsyncDealsLayout = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals' /* webpackChunkName: "deal_i" */),
  fetchData: (dispatch, params) => {
    const { user } = params
    const isBackOffice = user.features.indexOf('Backoffice') !== -1
    return dispatch(getDeals(user, isBackOffice))
  }
})

const AsyncDealsList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/list' /* webpackChunkName: "deal_l" */)
})

const AsyncDealDashboard = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Deals/dashboard' /* webpackChunkName: "deal_d" */)
})

// contacts
const AsyncContacts = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Contacts' /* webpackChunkName: "contact" */),
  fetchData: (dispatch, { user }) => dispatch(getContacts(user))
})

const AsyncContactsList = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Contacts/List' /* webpackChunkName: "contact_l" */)
})

const AsyncContactProfile = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Contacts/Profile' /* webpackChunkName: "contact_p" */)
})

// chat room
const AsyncRecents = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Chatroom' /* webpackChunkName: "chat" */)
})

const AsyncListingsFavorites = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Listings/Favorites' /* webpackChunkName: "fav" */)
})

const AsyncListingSinglePage = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Listings/Listing' /* webpackChunkName: "list_single" */)
})

// Notifications
const AsyncNotificationsPage = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Notifications' /* webpackChunkName: "notif_p" */)
})

// Widgets
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

// store and other pages
const AsyncWebsite = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Website' /* webpackChunkName: "website" */)
})

const AsyncCards = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Cards' /* webpackChunkName: "card" */)
})

const AsyncForms = Load({
  loader: () =>
    import('../components/Pages/Dashboard/Forms' /* webpackChunkName: "form" */)
})

const AsyncMobile = Load({
  loader: () =>
    import('../components/Pages/Mobile' /* webpackChunkName: "mobile" */)
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
        path="/register"
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
      <Route
        path="/password/reset"
        component={UserIsNotAuthenticated(AsyncResetPassword)}
      />

      <Route path="/mobile" component={AsyncMobile} />
    </Route>

    <Route path="/" component={AppLayout}>
      <Route path="/widgets/map" component={AsyncMapWidget} />
      <Route path="/widgets/search" component={AsyncSearchWidget} />
      <Route path="/widgets/listings" component={AsyncListingsWidget} />

      <Route path="dashboard/mls" component={AsyncListingsLayout}>
        <IndexRoute component={AsyncListingsSearch} />
      </Route>
    </Route>

    <Route path="/" component={AppLayout} onEnter={authenticate}>
      <Route path="/branch" component={AsyncBranch} />

      <Route path="/account/upgrade" component={AsyncUpgradeAccount} />

      <Route path="/widgets/map" component={AsyncMapWidget} />
      <Route path="/widgets/search" component={AsyncSearchWidget} />
      <Route path="/widgets/listings" component={AsyncListingsWidget} />

      <Route path="/account/settings" component={AsyncSettings} />
      <Route path="/account/notifications" component={AsyncNotifications} />

      <Route path="dashboard/mls" component={AsyncListingsLayout}>
        <IndexRoute component={AsyncListingsSearch} />

        <Route path="actives" component={AsyncListingsFavorites} />
        <Route path="alerts" component={AsyncListingsAlerts}>
          <Route path=":alertId" component={AsyncListingsAlerts} />
        </Route>
      </Route>

      <Route path="/dashboard/mls/:id" component={AsyncListingSinglePage} />

      <Route path="/dashboard/website" component={AsyncWebsite} />
      <Route path="/dashboard/cards" component={AsyncCards} />
      <Route path="/dashboard/forms" component={AsyncForms} />

      <Route path="/dashboard/contacts" component={AsyncContacts}>
        <IndexRoute component={AsyncContactsList} />
        <Route path="/dashboard/contacts/:id" component={AsyncContactProfile} />
      </Route>

      <Route path="/dashboard/deals(/filter/:filter)" component={AsyncDealsLayout}>
        <IndexRoute component={AsyncDealsList} />
        <Route path="/dashboard/deals/:id" component={AsyncDealDashboard} />
      </Route>
      <Route path="/dashboard/brand" component={Brand} />

      <Route path="/dashboard/recents(/:roomId)">
        <IndexRoute component={AsyncRecents} />
      </Route>

      <Route
        path="/dashboard/notifications"
        component={AsyncNotificationsPage}
      />
    </Route>

    <Route path="/oops" component={AsyncOops} />
    <Route path="*" component={AsyncNoMatch} />
  </Route>
)

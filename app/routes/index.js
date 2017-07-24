import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import Loadable from 'react-loadable'
import store from '../stores'
import Load from '../loader'

// Containers
const AsyncAppLayout = Load({
  loader: () => import('../components/App')
})

const AsyncAuthenticationLayout = Load({
  loader: () => import('../components/Authentication')
})

// Pages
const AsyncLanding = Load({
  loader: () => import('../components/Pages/Landing')
})

const AsyncSignUp = Load({
  loader: () => import('../components/Pages/SignUp')
})

const AsyncSignIn = Load({
  loader: () => import('../components/Pages/SignIn')
})

const AsyncVerify = Load({
  loader: () => import('../components/Pages/Verify')
})

const AsyncPassword = Load({
  loader: () => import('../components/Pages/Password')
})

const AsyncConfirmAgent = Load({
  loader: () => import('../components/Pages/SignUp/ConfirmAgent')
})

const AsyncNoMatch = Load({
  loader: () => import('../components/Pages/NoMatch')
})

const AsyncBranch = Load({
  loader: () => import('../components/Pages/Branch')
})

const AsyncSettings = Load({
  loader: () => import('../components/Pages/Account/Settings')
})

const AsyncNotifications = Load({
  loader: () => import('../components/Pages/Account/Notifications')
})

// listings
const AsyncListingsLayout = Load({
  loader: () => import('../components/Pages/Dashboard/Listings')
})

const AsyncListingsSearch = Load({
  loader: () => import('../components/Pages/Dashboard/Listings/Search')
})

const AsyncListingsAlerts = Load({
  loader: () => import('../components/Pages/Dashboard/Listings/Alerts')
})

// deals
// import DealEditForm from '../components/Pages/Dashboard/Deals/Edit-Form'
// import CollectSignatures_Documents from '../components/Pages/Dashboard/Deals/CollectSignatures-Documents'
// import CollectSignatures_Recipients from '../components/Pages/Dashboard/Deals/CollectSignatures-Recipients'
const AsyncDealsLayout = Loadable({
  loader: () => import('../components/Pages/Dashboard/Deals')
})

const AsyncDealsList = Loadable({
  loader: () => import('../components/Pages/Dashboard/Deals/list')
})

const AsyncDealCreate = Loadable({
  loader: () => import('../components/Pages/Dashboard/Deals/create')
})

const AsyncDealDashboard = Loadable({
  loader: () => import('../components/Pages/Dashboard/Deals/dashboard')
})

// contacts
const AsyncContacts = Loadable({
  loader: () => import('../components/Pages/Dashboard/Contacts')
})

const AsyncContactsList = Loadable({
  loader: () => import('../components/Pages/Dashboard/Contacts/List')
})

const AsyncContactProfile = Loadable({
  loader: () => import('../components/Pages/Dashboard/Contacts/Profile')
})

// chat room
// import Recents from '../components/Pages/Dashboard/Chatroom'
const AsyncRecents = Loadable({
  loader: () => import('../components/Pages/Dashboard/Chatroom')
})

const AsyncListingsFavorites = Load({
  loader: () => import('../components/Pages/Dashboard/Listings/Favorites')
})

const AsyncListingSinglePage = Load({
  loader: () => import('../components/Pages/Dashboard/Listings/Listing')
})

// contacts
const AsyncContacts = Load({
  loader: () => import('../components/Pages/Dashboard/Contacts')
})

const AsyncContactsList = Load({
  loader: () => import('../components/Pages/Dashboard/Contacts/List')
})

const AsyncContactProfile = Load({
  loader: () => import('../components/Pages/Dashboard/Contacts/Profile')
})

// chat room
const AsyncRecents = Load({
  loader: () => import('../components/Pages/Dashboard/Chatroom')
})

// Notifications
const AsyncNotificationsPage = Load({
  loader: () => import('../components/Pages/Dashboard/Notifications')
})

// Widgets
const AsyncListingsWidget = Load({
  loader: () => import('../components/Pages/Widgets/Listings')
})

const AsyncMapWidget = Load({
  loader: () => import('../components/Pages/Widgets/Map')
})

const AsyncSearchWidget = Load({
  loader: () => import('../components/Pages/Widgets/Search')
})

// store and other pages
const AsyncWebsite = Load({
  loader: () => import('../components/Pages/Dashboard/Website')
})

const AsyncCards = Load({
  loader: () => import('../components/Pages/Dashboard/Cards')
})

const AsyncForms = Load({
  loader: () => import('../components/Pages/Dashboard/Forms')
})

const AsyncMobile = Load({
  loader: () => import('../components/Pages/Mobile')
})

function authenticate(nextState, replace) {
  const { data } = store.getState()
  const isLoggedIn = data.user && data.user.access_token

  const noAuthList = [
    '/dashboard/mls',
    '/dashboard/mls/:id',
    'listings',
    'listings/:id',
    '/branch',
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
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export default (
  <Route>
    <Route path="/" component={AsyncAuthenticationLayout}>
      <IndexRoute component={AsyncLanding} />
      <Route path="/signup" component={AsyncSignUp} />
      <Route path="/signup/agent" component={AsyncConfirmAgent} />
      <Route path="/signin" component={AsyncSignIn} />
      <Route path="/verify/:slug" component={AsyncVerify} />
      <Route path="/password/:slug" component={AsyncPassword} />

      <Route path="/mobile" component={AsyncMobile} />
    </Route>

    <Route path="/" component={AsyncAppLayout}>
      <Route path="/branch" component={AsyncBranch} />
      <Route path="/widgets/map" component={AsyncMapWidget} />
      <Route path="/widgets/search" component={AsyncSearchWidget} />
      <Route path="/widgets/listings" component={AsyncListingsWidget} />

      <Route path="dashboard/mls" component={AsyncListingsLayout}>
        <IndexRoute component={AsyncListingsSearch} />
      </Route>
    </Route>

    <Route path="/" component={AsyncAppLayout} onEnter={authenticate}>
      <Route path="/branch" component={AsyncBranch} />
      <Route path="/widgets/map" component={AsyncMapWidget} />
      <Route path="/widgets/search" component={AsyncSearchWidget} />
      <Route path="/widgets/listings" component={AsyncListingsWidget} />

      <Route path="/account/settings" component={AsyncSettings} />
      <Route path="/account/notifications" component={AsyncNotifications} />

      <Route path="dashboard/mls" component={AsyncListingsLayout}>
        <IndexRoute component={AsyncListingsSearch} />
        <Route path="alerts" component={AsyncListingsAlerts} />
        <Route path="actives" component={AsyncListingsFavorites} />
      </Route>

      <Route path="/dashboard/mls/:id" component={AsyncListingSinglePage} />

      <Route path="/dashboard/website" component={AsyncWebsite} />
      <Route path="/dashboard/cards" component={AsyncCards} />
      <Route path="/dashboard/forms" component={AsyncForms} />

      <Route path="/dashboard/recents(/:roomId)">
        <IndexRoute component={AsyncRecents} />
      </Route>

      <Route path="/dashboard/contacts" component={AsyncContacts}>
        <IndexRoute component={AsyncContactsList} />
        <Route path="/dashboard/contacts/:id" component={AsyncContactProfile} />
      </Route>

      <Route path="/dashboard/deals" component={AsyncDealsLayout}>
        <IndexRoute component={AsyncDealsList} />
        <Route path="/dashboard/deal/:id" component={AsyncDealDashboard} />
        <Route path="/dashboard/deal/create/:type" component={AsyncDealCreate} />
      </Route>

      <Route path="/dashboard/contacts" component={AsyncContacts}>
        <IndexRoute component={AsyncContactsList} />
        <Route path="/dashboard/contacts/:id" component={AsyncContactProfile} />
      </Route>

      <Route path="/dashboard/notifications" component={AsyncNotificationsPage} />
    </Route>

    <Route path="*" component={AsyncNoMatch} />
  </Route>
)

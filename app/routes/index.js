import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import store from '../stores'

// Containers
import App from '../components/App'
import Authentication from '../components/Authentication'

// Pages
import Landing from '../components/Pages/Landing'
// import Recents from '../components/Pages/Dashboard/Recents'

import SignUp from '../components/Pages/SignUp'
import SignIn from '../components/Pages/Auth/SignIn'
import Verify from '../components/Pages/Verify'
import ForgotPassword from '../components/Pages/Auth/Password/Forgot'
import ResetPassword from '../components/Pages/Auth/Password/Reset'
import ConfirmAgent from '../components/Pages/SignUp/ConfirmAgent'

import NoMatch from '../components/Pages/NoMatch'

import Branch from '../components/Pages/Branch'
import Settings from '../components/Pages/Account/Settings'

import Notifications from '../components/Pages/Account/Notifications'

// listings [old mls]
import ListingsLayout from '../components/Pages/Dashboard/Listings'
import ListingsSearch from '../components/Pages/Dashboard/Listings/Search'
import ListingsAlerts from '../components/Pages/Dashboard/Listings/Alerts'
import ListingsFavorites from '../components/Pages/Dashboard/Listings/Favorites'

import ListingSinglePage from '../components/Pages/Dashboard/Listings/Listing'

// // mls
// import Mls from '../components/Pages/Dashboard/Mls'
// import Agents from '../components/Pages/Dashboard/Mls/Agents'
// import Listing from '../components/Pages/Dashboard/Mls/Listing'

// deals
// import DealsLayout from '../components/Pages/Dashboard/Deals'
// import DealsList from '../components/Pages/Dashboard/Deals/DealsList'
// import DealCreate from '../components/Pages/Dashboard/Deals/DealCreate'
// import DealDashboard from '../components/Pages/Dashboard/Deals/Dashboard'
// import DealEditForm from '../components/Pages/Dashboard/Deals/Edit-Form'
// import CollectSignatures_Documents from '../components/Pages/Dashboard/Deals/CollectSignatures-Documents'
// import CollectSignatures_Recipients from '../components/Pages/Dashboard/Deals/CollectSignatures-Recipients'

// contacts
import Contacts from '../components/Pages/Dashboard/Contacts'
import ContactsList from '../components/Pages/Dashboard/Contacts/List'
import ContactProfile from '../components/Pages/Dashboard/Contacts/Profile'

// chat room
import Recents from '../components/Pages/Dashboard/Chatroom'

// Notifications
import NotificationsPage from '../components/Pages/Dashboard/Notifications'

// Widgets
import ListingsWidget from '../components/Pages/Widgets/Listings'
import MapWidget from '../components/Pages/Widgets/Map'
import SearchWidget from '../components/Pages/Widgets/Search'

// store and other pages
import Website from '../components/Pages/Dashboard/Website'
import Cards from '../components/Pages/Dashboard/Cards'
import Forms from '../components/Pages/Dashboard/Forms'

import Mobile from '../components/Pages/Mobile'

const uuidPattern = 'w+'

function authenticate(nextState, replace) {
  const { data } = store.getState()
  const isLoggedIn = data.user && data.user.access_token

  const noAuthList = [
    '/dashboard/mls',
    '/dashboard/mls/:id',
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
    <Route path="/" component={Authentication}>
      <IndexRoute component={Landing} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signup/agent" component={ConfirmAgent} />
      <Route path="/signin" component={SignIn} />
      <Route path="/verify/:slug" component={Verify} />

      <Route path="/password/forgot" component={ForgotPassword} />
      <Route path="/password/reset" component={ResetPassword} />

      <Route path="/mobile" component={Mobile} />
    </Route>

    <Route path="/" component={App}>
      <Route path="/branch" component={Branch} />
      <Route path="/widgets/map" component={MapWidget} />
      <Route path="/widgets/search" component={SearchWidget} />
      <Route path="/widgets/listings" component={ListingsWidget} />

      <Route path="dashboard/mls" component={ListingsLayout}>
        <IndexRoute component={ListingsSearch} />
      </Route>
    </Route>

    <Route path="/" component={App} onEnter={authenticate}>
      <Route path="/branch" component={Branch} />
      <Route path="/widgets/map" component={MapWidget} />
      <Route path="/widgets/search" component={SearchWidget} />
      <Route path="/widgets/listings" component={ListingsWidget} />

      <Route path="/account/settings" component={Settings} />
      <Route path="/account/notifications" component={Notifications} />

      <Route path="dashboard/mls" component={ListingsLayout}>
        <IndexRoute component={ListingsSearch} />
        <Route path="actives" component={ListingsFavorites} />
        <Route path="alerts" component={ListingsAlerts}>
          <Route path=":alertId" component={ListingsAlerts} />
        </Route>
      </Route>

      <Route path="/dashboard/mls/:id" component={ListingSinglePage} />

      <Route path="/dashboard/website" component={Website} />
      <Route path="/dashboard/cards" component={Cards} />
      <Route path="/dashboard/forms" component={Forms} />

      <Route path="/dashboard/recents(/:roomId)">
        <IndexRoute component={Recents} />
      </Route>

      <Route path="/dashboard/contacts" component={Contacts}>
        <IndexRoute component={ContactsList} />
        <Route path="/dashboard/contacts/:id" component={ContactProfile} />
      </Route>

      <Route path="/dashboard/notifications" component={NotificationsPage} />
    </Route>

    <Route path="*" component={NoMatch} />
  </Route>
)

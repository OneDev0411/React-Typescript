// Config.js
import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

// Main component
import App from '../components/App'
import Dashboard from '../components/Dashboard'

// Pages
import Landing from '../components/Pages/Landing'
import Recents from '../components/Pages/Dashboard/Recents'
import Mls from '../components/Pages/Dashboard/Mls'
import Listing from '../components/Pages/Dashboard/Mls/Listing'
import SignUp from '../components/Pages/SignUp'
import ConfirmAgent from '../components/Pages/SignUp/ConfirmAgent'
import SignIn from '../components/Pages/SignIn'
import Verify from '../components/Pages/Verify'
import Password from '../components/Pages/Password'
import NoMatch from '../components/Pages/NoMatch'
import Settings from '../components/Pages/Account/Settings'
import Notifications from '../components/Pages/Account/Notifications'
import Recommend from '../components/Pages/Dashboard/Mls/Listing/Recommend'
import Agents from '../components/Pages/Dashboard/Mls/Agents'
import Branch from '../components/Pages/Branch'
import Website from '../components/Pages/Dashboard/Website'
import Cards from '../components/Pages/Dashboard/Cards'
import Forms from '../components/Pages/Dashboard/Forms'

// cluster MLS
import ClusterMLS from '../components/Pages/Dashboard/ClusterMap/'

// deals
import DealsLayout from '../components/Pages/Dashboard/Deals'
import DealsList from '../components/Pages/Dashboard/Deals/DealsList'
import DealCreate from '../components/Pages/Dashboard/Deals/DealCreate'
import DealDashboard from '../components/Pages/Dashboard/Deals/Dashboard'
import DealEditForm from '../components/Pages/Dashboard/Deals/Edit-Form'
import CollectSignatures_Documents from '../components/Pages/Dashboard/Deals/CollectSignatures-Documents'
import CollectSignatures_Recipients from '../components/Pages/Dashboard/Deals/CollectSignatures-Recipients'

// Concierge
import ConciergeLayout from '../components/Pages/Dashboard/Concierge'
import ConciergeDealsList from '../components/Pages/Dashboard/Concierge/DealsList'
import DealReview from '../components/Pages/Dashboard/Concierge/DealReview'

// contacts
import Contacts from '../components/Pages/Dashboard/Contacts'
import ContactsList from '../components/Pages/Dashboard/Contacts/List'
import ContactProfile from '../components/Pages/Dashboard/Contacts/Profile'

// Notifications
import NotificationsPage from '../components/Pages/Dashboard/Notifications'

// Widgets
import ListingsWidget from '../components/Pages/Widgets/Listings'
import MapWidget from '../components/Pages/Widgets/Map'
import SearchWidget from '../components/Pages/Widgets/Search'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Landing} />
    <Route path="signup" component={SignUp} />
    <Route path="signup/agent" component={ConfirmAgent} />
    <Route path="signin" component={SignIn} />
    <Route path="branch" component={Branch} />
    <Route path="account/settings" component={Settings} />
    <Route path="account/notifications" component={Notifications} />
    <Redirect from="dashboard" to="dashboard/recents" />
    <Route path="dashboard/recents" component={Recents} />
    <Route path="dashboard/recents/:room_id" component={Recents} />
    <Route path="dashboard/mls" component={Mls} />
    <Route path="dashboard/mls/agents" component={Agents} />
    <Route path="dashboard/mls/alerts" component={Mls} />
    <Route path="dashboard/mls/alerts/:alert_id" component={Mls} />
    <Route path="dashboard/mls/actives" component={Mls} />
    <Route path="dashboard/mls/:id" component={Listing} />
    <Route path="dashboard/mls/listing/recommend" component={Recommend} />
    <Route path="dashboard/website" component={Website} />
    <Route path="dashboard/cards" component={Cards} />
    <Route path="dashboard/forms" component={Forms} />
    <Route path="verify/:slug" component={Verify} />
    <Route path="password/:slug" component={Password} />
    <Route path="widgets/listings" component={ListingsWidget} />
    <Route path="widgets/map" component={MapWidget} />
    <Route path="widgets/search" component={SearchWidget} />

    <Route path="/dashboard" component={Dashboard}>

      <Route path="/dashboard/cluster-mls" component={ClusterMLS} />

      <Route path="/dashboard/deals" component={DealsLayout}>
        <IndexRoute component={DealsList} />
        <Route path="/dashboard/deals/create/:type" component={DealCreate} />
        <Route path="/dashboard/deals/:id(/:tab)" component={DealDashboard} />
        <Route path="/dashboard/deals/:id/edit-form/:form/:type" component={DealEditForm} />
        <Route path="/dashboard/deals/:id/collect-signatures/documents" component={CollectSignatures_Documents} />
        <Route path="/dashboard/deals/:id/collect-signatures/recipients" component={CollectSignatures_Recipients} />
      </Route>

      <Route path="/dashboard/concierge/deals" component={ConciergeLayout}>
        <IndexRoute component={ConciergeDealsList} />
        <Route path="/dashboard/concierge/deals/:id" component={DealReview} />
      </Route>

      <Route path="/dashboard/contacts" component={Contacts}>
        <IndexRoute component={ContactsList} />
        <Route path="/dashboard/contacts/:id" component={ContactProfile} />
      </Route>
    </Route>

    <Route path="/dashboard/notifications" component={NotificationsPage} />

    <Route path="*" component={NoMatch} />
  </Route>
)

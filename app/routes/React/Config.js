// Config.js
import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

// Main component
import App from '../../components/App'

// Pages
import Landing from '../../components/Pages/Landing'
import Recents from '../../components/Pages/Dashboard/Recents'
import Mls from '../../components/Pages/Dashboard/Mls'
import Contacts from '../../components/Pages/Dashboard/Contacts'
import Tasks from '../../components/Pages/Dashboard/Tasks'
import Transactions from '../../components/Pages/Dashboard/Transactions'
import SingleTransaction from '../../components/Pages/Dashboard/Transactions/Single'
import NewTransaction from '../../components/Pages/Dashboard/Transactions/New'
import SignUp from '../../components/Pages/SignUp'
import SignIn from '../../components/Pages/SignIn'
import Verify from '../../components/Pages/Verify'
import Password from '../../components/Pages/Password'
import NoMatch from '../../components/Pages/NoMatch'
import Settings from '../../components/Pages/Account/Settings'
import Notifications from '../../components/Pages/Account/Notifications'
import Recommend from '../../components/Pages/Dashboard/Mls/Listing/Recommend'
import Agents from '../../components/Pages/Dashboard/Mls/Agents'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Landing}/>
    <Route path="signup" component={SignUp}/>
    <Route path="signin" component={SignIn}/>
    <Route path="account/settings" component={Settings}/>
    <Route path="account/notifications" component={Notifications}/>
    <Redirect from="dashboard" to="dashboard/recents" />
    <Route path="dashboard/recents" component={Recents}/>
    <Route path="dashboard/recents/:room_id" component={Recents}/>
    <Route path="dashboard/mls" component={Mls}/>
    <Route path="dashboard/mls/agents" component={Agents}/>
    <Route path="dashboard/mls/listing/recommend" component={Recommend}/>
    <Route path="dashboard/contacts" component={Contacts}/>
    <Route path="dashboard/contacts/:id" component={Contacts}/>
    <Route path="dashboard/tasks" component={Tasks}/>
    <Route path="dashboard/transactions" component={Transactions}/>
    <Route path="dashboard/transactions/new" component={NewTransaction}/>
    <Route path="dashboard/transactions/:id" component={SingleTransaction}/>
    <Route path="dashboard/transactions/:id/attachments/:id" component={SingleTransaction}/>
    <Route path="verify/:slug" component={Verify}/>
    <Route path="password/:slug" component={Password}/>
    <Route path="*" component={NoMatch}/>
  </Route>
)
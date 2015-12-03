// Config.js
import React from 'react'
import { Route, IndexRoute } from 'react-router'

// Main component
import App from '../../components/App'

// Pages
import Home from '../../components/Pages/Home'
import Dashboard from '../../components/Pages/Dashboard/Index'
import SignUp from '../../components/Pages/SignUp'
import SignIn from '../../components/Pages/SignIn'
import Verify from '../../components/Pages/Verify/Index'
import Password from '../../components/Pages/Password/Index'
import NoMatch from '../../components/Pages/NoMatch'
import Settings from '../../components/Pages/Account/Settings'
import Notifications from '../../components/Pages/Account/Notifications'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/signup" component={SignUp}/>
    <Route path="/signin" component={SignIn}/>
    <Route path="/account/settings" component={Settings}/>
    <Route path="/account/notifications" component={Notifications}/>
    <Route path="/dashboard" component={Dashboard}/>
    <Route path="/dashboard/recents" component={Dashboard}/>
    <Route path="/dashboard/mls" component={Dashboard}/>
    <Route path="/dashboard/contacts" component={Dashboard}/>
    <Route path="/dashboard/tasks" component={Dashboard}/>
    <Route path="/dashboard/transactions" component={Dashboard}/>
    <Route path="/verify/:slug" component={Verify}/>
    <Route path="/password/:slug" component={Password}/>
    <Route path="*" component={NoMatch}/>
  </Route>
)
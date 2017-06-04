// Config.js
import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'


import ListingsLayout from '../../components/Pages/Dashboard/Listings'
import ListingsSearch from '../../components/Pages/Dashboard/Listings/Search'
import ListingsAlerts from '../../components/Pages/Dashboard/Listings/Alerts'
import ListingsFavorites from
  '../../components/Pages/Dashboard/Listings/Favorites'


export default (
  <Route path="/dashboard/listings" component={ListingsLayout}>
    <IndexRoute component={ListingsSearch} />
    <Route path="/dashboard/listings/alerts" component={ListingsAlerts} />
    <Route path="/dashboard/listings/favorites" component={ListingsFavorites} />
  </Route>
)

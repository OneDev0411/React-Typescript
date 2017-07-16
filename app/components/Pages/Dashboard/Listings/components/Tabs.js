import React from 'react'
import NavLink from './NavLink'

const Tabs = ({ isLoggedIn }) =>
  <ul className="c-listings__tabs">
    <NavLink indexed text="Search" to="/dashboard/mls" />
    {isLoggedIn && <NavLink text="Saved Search" to="/dashboard/mls/alerts" />}
    {isLoggedIn &&
      <NavLink text="Saved Listings" to="/dashboard/mls/actives" />}
  </ul>

export default Tabs

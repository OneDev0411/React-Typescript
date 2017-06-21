import React from 'react'
import NavLink from './NavLink'

const Tabs = ({ isLoggedIn }) =>
  <ul className="c-listings__tabs">
    <NavLink indexed text="Search" to="/listings" />
    {isLoggedIn && <NavLink text="Saved Search" to="/listings/alerts" />}
    {isLoggedIn && <NavLink text="Saved Listings" to="/listings/favorites" />}
  </ul>

export default Tabs

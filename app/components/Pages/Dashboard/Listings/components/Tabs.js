import React from 'react'
import NavLink from './NavLink'

const Tabs = () =>
  <ul className="c-listings__tabs">
    <NavLink indexed text="Search" to="/dashboard/mls" />
    <NavLink text="Saved Search" to="/dashboard/mls/alerts" />
    <NavLink text="Saved Properties" to="/dashboard/mls/actives" />
  </ul>

export default Tabs

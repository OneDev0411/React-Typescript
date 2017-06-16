import React from 'react'
import NavLink from './NavLink'
import { connect } from 'react-redux'

const Tabs = ({ user }) =>
  <ul className="c-listings__tabs">
    <NavLink indexed text="Search" to="/listings" />
    {user && <NavLink text="Saved Search" to="/listings/alerts" />}
    {user && <NavLink text="Saved Listings" to="/listings/favorites" />}
  </ul>

export default connect(({ data }) => ({ user: data.user }))(Tabs)

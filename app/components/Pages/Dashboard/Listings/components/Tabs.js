import React from 'react'
import NavLink from './NavLink'

export default function Tabs() {
  return (
    <ul className="c-listings__tabs">
      <NavLink indexed text="Search" to="/listings" />
      <NavLink text="Saved Search" to="/listings/alerts" />
      <NavLink text="Saved Listings" to="/listings/favorites" />
    </ul>
  )
}

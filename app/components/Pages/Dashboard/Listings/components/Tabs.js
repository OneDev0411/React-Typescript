import React from 'react'
import NavLink from './NavLink'

export default function Tabs() {
  return (
    <ul className="c-listings__tabs">
      <NavLink
        indexed
        text="Search"
        to="/dashboard/listings"
      />
      <NavLink
        text="Alerts"
        to="/dashboard/listings/alerts"
      />
      <NavLink
        text="Favorites"
        to="/dashboard/listings/favorites"
      />
    </ul>
  )
}
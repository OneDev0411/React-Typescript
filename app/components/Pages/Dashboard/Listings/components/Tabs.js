import React from 'react'
import NavLink from './NavLink'
import { Link, IndexLink } from 'react-router'

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
        text="Bookmarks"
        to="/dashboard/listings/bookmarks"
      />
    </ul>
  )
}
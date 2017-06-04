import React from 'react'
import { Link, IndexLink } from 'react-router'

export default function Tabs({
  to,
  text,
  indexed
}) {
  return (
    <li className="c-listings__tabs__item">
      <Link
        to={to}
        onlyActiveOnIndex={indexed}
        className="c-listings__tabs__link"
        activeClassName="c-listings__tabs__link--active"
      >
        <span>{text}</span>
      </Link>
    </li>
  )
}
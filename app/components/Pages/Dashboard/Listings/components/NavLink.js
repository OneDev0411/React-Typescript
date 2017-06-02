import React from 'react'
import { Link, IndexLink } from 'react-router'

export default function Tabs({
  to,
  text,
  indexed
}) {
  return (
    <li className="c-listings__tabs__item">
      {
        indexed ?
          <IndexLink
            to={to}
            className="c-listings__tabs__link"
            activeClassName="c-listings__tabs__link--active"
          >
            <span>{text}</span>
          </IndexLink>
        :
          <Link
            to={to}
            className="c-listings__tabs__link"
            activeClassName="c-listings__tabs__link--active"
          >
            <span>{text}</span>
          </Link>
      }
    </li>
  )
}
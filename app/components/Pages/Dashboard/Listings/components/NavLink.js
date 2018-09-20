import React from 'react'
import { Link } from 'react-router'
import Brand from '../../../../../controllers/Brand'

export default function Tabs({ to, text, indexed }) {
  return (
    <li className="c-listings__tabs__item">
      <Link
        to={to}
        onlyActiveOnIndex={indexed}
        className="c-listings__tabs__link"
        activeClassName="c-listings__tabs__link--active"
        activeStyle={{
          borderBottomColor: `#${Brand.color('primary', '3388ff')}`
        }}
      >
        <span className="c-listings__tabs__link__text">{text}</span>
      </Link>
    </li>
  )
}

import React from 'react'
import { Link } from 'react-router'

const Tab = ({ to, text, disabled, indexed }) => (
  <li>
    <Link
      to={to}
      onlyActiveOnIndex={indexed}
      activeClassName="c-tabs__tab--active"
      className={`c-tabs__tab ${disabled ? 'c-tabs__tab--disabled' : ''}`}
    >
      <span>{text}</span>
    </Link>
  </li>
)

export default Tab

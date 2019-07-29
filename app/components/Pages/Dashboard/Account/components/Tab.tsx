import React from 'react'
import { Link } from 'react-router'

interface Props {
  to: string
  text: string
  disabled?: boolean
  indexed?: boolean
}

const Tab = ({ to, text, disabled, indexed }: Props) => (
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

import React from 'react'
import { Link } from 'react-router'

export default function Header() {
  return (
    <div className="profile__header">
      <h1 className="profile__header__title">
        <Link to="/dashboard/contacts">
          <i className="fa fa-angle-left" />
          <span>Contacts</span>
        </Link>
      </h1>
    </div>
  )
}

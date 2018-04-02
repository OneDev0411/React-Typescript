import React from 'react'

const Header = ({ onClose }) => (
  <div className="profile__header">
    <h1 className="profile__header__title">
      <span>Import a CSV file</span>
    </h1>

    <div className="profile__header__close">
      <i className="fa fa-times" onClick={onClose} />
    </div>
  </div>
)

export default Header

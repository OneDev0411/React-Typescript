import React from 'react'
import UserAvatar from '../../../../Partials/UserAvatar'

export default ({
  person,
  onClick,
  onRemove
}) => (
  <div
    className="entity-item people"
    onClick={onClick}
  >
    <UserAvatar
      name={`${person.first_name} ${person.last_name}`}
      size={24}
      showStateIndicator={false}
    />

    <span className="name">
      {person.first_name} {person.last_name}
    </span>

    <span
      className="remove"
      onClick={(e) => {
        e.stopPropagation()
        onRemove(person.email)
      }}
    >
      <i className="fa fa-times" />
    </span>
  </div>
)

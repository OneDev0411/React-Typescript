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
      name={`${person.legal_first_name} ${person.legal_last_name}`}
      size={24}
      showStateIndicator={false}
    />

    <span className="name">
      {person.legal_prefix} {person.legal_first_name} {person.legal_last_name}
    </span>

    <span
      className="remove"
      onClick={(e) => {
        e.stopPropagation()
        onRemove(person.id)
      }}
    >
      <i className="fa fa-times" />
    </span>
  </div>
)

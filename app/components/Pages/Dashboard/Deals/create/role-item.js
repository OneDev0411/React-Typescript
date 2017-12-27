import React from 'react'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'

export default ({
  person,
  onClick,
  onRemove
}) => (
  <div
    className={cn('entity-item people', { disabled: person.disabled })}
    onClick={() => !person.disabled && onClick()}
  >
    <UserAvatar
      name={`${person.legal_first_name} ${person.legal_last_name}`}
      size={24}
      showStateIndicator={false}
    />

    <span className="name">
      {person.legal_prefix} {person.legal_first_name} {person.legal_last_name}
    </span>

    {
      !person.disabled &&
      <span
        className="remove"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(person.email)
        }}
      >
        <i className="fa fa-times" />
      </span>
    }
  </div>
)

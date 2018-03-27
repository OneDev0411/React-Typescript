import React from 'react'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'

export default ({ person, onClick, onRemove }) => {
  let name = ''

  if (person.legal_full_name) {
    name += person.legal_prefix ? `${person.legal_prefix} ` : ''
    name += person.legal_full_name
  } else if (person.legal_first_name || person.legal_last_name) {
    name += person.legal_prefix ? `${person.legal_prefix} ` : ''
    name += person.legal_first_name ? `${person.legal_first_name} ` : ''
    name += person.legal_last_name ? `${person.legal_last_name} ` : ''
  } else {
    name = person.company_title
  }

  return (
    <div
      className={cn('entity-item people', { disabled: person.disabled })}
      onClick={() => !person.disabled && onClick()}
    >
      <UserAvatar
        name={`${person.legal_first_name} ${person.legal_last_name}`}
        image={person.profile_image_url}
        size={24}
        showStateIndicator={false}
      />

      <span className="name">{name}</span>

      {!person.disabled && (
        <span
          className="remove"
          onClick={e => {
            e.stopPropagation()
            onRemove(person.id)
          }}
        >
          <i className="fa fa-times" />
        </span>
      )}
    </div>
  )
}

import React from 'react'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'
import { getLegalFullName } from '../utils/roles'

export default ({ user, onClick, onRemove }) => (
  <div
    className={cn('entity-item people', {
      disabled: user.isEditable === false
    })}
    onClick={() => user.isEditable !== false && onClick()}
  >
    <UserAvatar
      name={`${user.legal_first_name} ${user.legal_last_name}`}
      image={user.profile_image_url}
      size={24}
      showStateIndicator={false}
    />

    <span className="name">{getLegalFullName(user)}</span>

    {user.isRemovable !== false && (
      <span
        className="remove"
        onClick={e => {
          e.stopPropagation()
          onRemove(user.id, user)
        }}
      >
        <i className="fa fa-times" />
      </span>
    )}
  </div>
)

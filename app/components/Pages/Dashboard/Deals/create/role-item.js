import React from 'react'
import cn from 'classnames'
import { IconButton } from '@material-ui/core'

import UserAvatar from 'components/UserAvatar'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { closeIcon } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      color="#000000"
      showStateIndicator={false}
    />

    <span className="name">{getLegalFullName(user)}</span>

    {user.isRemovable !== false && (
      <IconButton
        size="small"
        onClick={e => {
          e.stopPropagation()
          onRemove(user.id, user)
        }}
      >
        <SvgIcon path={closeIcon} size={muiIconSizes.small} />
      </IconButton>
    )}
  </div>
)

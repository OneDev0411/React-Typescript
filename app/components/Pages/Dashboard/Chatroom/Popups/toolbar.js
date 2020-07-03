import React from 'react'
import cn from 'classnames'
import { mdiWindowMinimize, mdiArrowTopRight, mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import Members from '../Rooms/members'

export default ({ room, isActive, onMinimize, onMaximize, onClose }) => (
  <div
    className={cn('bar', {
      blinking: room.new_notifications > 0,
      isActive
    })}
  >
    <div className="room-title" onClick={() => onMinimize(room.id)}>
      {room.proposed_title}
    </div>

    <div className="icons">
      <span className="icon" onClick={() => onMinimize(room.id)}>
        <SvgIcon
          path={mdiWindowMinimize}
          size={muiIconSizes.small}
          color={isActive ? '#fff' : '#b2b2b2'}
          onClick={() => onClose(room.id)}
        />
      </span>

      <span className="icon" onClick={() => onMaximize(room.id)}>
        <SvgIcon
          path={mdiArrowTopRight}
          size={muiIconSizes.small}
          color={isActive ? '#fff' : '#b2b2b2'}
          onClick={() => onClose(room.id)}
        />
      </span>

      <Members room={room} iconSize={12} />

      <span className="icon">
        <SvgIcon
          path={mdiClose}
          size={muiIconSizes.small}
          color={isActive ? '#fff' : '#b2b2b2'}
          onClick={() => onClose(room.id)}
        />
      </span>
    </div>
  </div>
)

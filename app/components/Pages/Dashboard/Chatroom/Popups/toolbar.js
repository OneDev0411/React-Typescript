import React from 'react'
import cn from 'classnames'
import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Members from '../Rooms/members'
import FullscreenIcon from '../../Partials/Svgs/FullscreenIcon'
import MinimizeIcon from '../../Partials/Svgs/MinimizeIcon'

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
      <span
        className="icon minimize minimize-icon"
        onClick={() => onMinimize(room.id)}
      >
        <MinimizeIcon />
      </span>

      <span
        className="icon maximize maximize-icon"
        onClick={() => onMaximize(room.id)}
      >
        <FullscreenIcon />
      </span>

      <Members room={room} iconSize={12} />

      <span className="icon times">
        <SvgIcon
          path={mdiClose}
          size="1rem"
          color="#fff"
          onClick={() => onClose(room.id)}
        />
      </span>
    </div>
  </div>
)

import React from 'react'

import ToolTip from '../../../../../../../../views/components/tooltip'
import Badge from '../../../../../../../../views/components/Badge'
import styled from 'styled-components'
import IconChat from '../../../../../../../../views/components/SvgIcons/NewChat/IconChat'

const NotificationsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  position: relative;
`
const Notification = ({ count, caption }) => {
  if (count === 0) {
    return null
  }

  return (
    <ToolTip caption={caption.replace('$count', count)}>
      <NotificationsContainer>
        <IconChat />
        <Badge
          style={{
            position: 'absolute',
            top: '-11px',
            left: 'calc(100% - 30px)'
          }}
        >
          {count > 99 ? '99+' : count}
        </Badge>
      </NotificationsContainer>
    </ToolTip>
  )
}

export default Notification

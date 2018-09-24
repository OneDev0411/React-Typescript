import React from 'react'

import ToolTip from '../../../../../../../../views/components/tooltip'
import Badge from '../../../../../../../../views/components/Badge'
import styled from 'styled-components'

const NotificationsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const Notification = ({ count, caption }) => {
  if (count === 0) {
    return null
  }

  return (
    <ToolTip caption={caption.replace('$count', count)}>
      <NotificationsContainer>
        <Badge>{count > 99 ? '99+' : count}</Badge>
      </NotificationsContainer>
    </ToolTip>
  )
}

export default Notification

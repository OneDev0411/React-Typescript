import React from 'react'
import styled from 'styled-components'

import ToolTip from '../../../../../../../../views/components/tooltip'

export const NotificationBadge = styled.div`
  background-color: #ff4747;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  width: 23px;
  height: 23px;
  font-size: 14px;
  padding: 2px;
`

const Notification = ({ count, caption }) => {
  if (count === 0) {
    return null
  }

  return (
    <ToolTip caption={caption.replace('$count', count)}>
      <NotificationBadge>{count}</NotificationBadge>
    </ToolTip>
  )
}

export default Notification

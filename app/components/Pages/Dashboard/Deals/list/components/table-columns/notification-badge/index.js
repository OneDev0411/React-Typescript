import React from 'react'

import ToolTip from '../../../../../../../../views/components/tooltip'
import Badge from '../../../../../../../../views/components/Badge'

const Notification = ({ count, caption }) => {
  if (count === 0) {
    return null
  }

  return (
    <ToolTip caption={caption.replace('$count', count)}>
      <Badge>{count > 99 ? '99+' : count}</Badge>
    </ToolTip>
  )
}

export default Notification

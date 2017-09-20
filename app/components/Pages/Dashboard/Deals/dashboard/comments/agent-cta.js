import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

export default ({
  task,
  hasComment,
  onSendComment
}) => (
  <div>
    <Button
      className={cn('deal-button add-comment', {
        enabled: hasComment === true
      })}
      onClick={() => onSendComment()}
    >
      Add Comment
    </Button>

    <Button
      className={cn('deal-button notify-admin', {
        enabled: hasComment === true
      })}
      onClick={() => onSendComment(true)}
    >
      Notify Admin
    </Button>
  </div>
)

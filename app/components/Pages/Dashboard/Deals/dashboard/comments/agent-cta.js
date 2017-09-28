import React from 'react'
import ReactTooltip from 'react-tooltip'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

export default ({
  task,
  hasComment,
  onSendComment
}) => (
  <div>
    <ReactTooltip
      place="top"
      className="deal-filter--tooltip"
      multiline
    />

    <Button
      className={cn('deal-button add-comment', {
        enabled: hasComment === true
      })}
      data-tip="Send your comment and admin will get notified immediately"
      onClick={() => onSendComment()}
    >
      Add Comment
    </Button>

    <Button
      className={cn('deal-button notify-admin', {
        enabled: hasComment === true
      })}
      data-tip="Adding your message as a comment won't disturb anyone"
      onClick={() => onSendComment(true)}
    >
      Notify Admin
    </Button>
  </div>
)

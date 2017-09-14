import React from 'react'
import cn from 'classnames'

export default ({
  task,
  hasComment,
  onSendComment
}) => (
  <div>
    <button
      className={cn('deal-button add-comment', {
        enabled: hasComment === true
      })}
      onClick={() => onSendComment()}
    >
      Add Comment
    </button>

    <button
      className={cn('deal-button notify-admin', {
        enabled: hasComment === true
      })}
      onClick={() => onSendComment(true)}
    >
      Notify Admin
    </button>
  </div>
)

import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

export default ({
  task,
  onSendComment,
  onDecline,
  onApprove,
  hasComment,
  isSaving
}) => {
  const status = task.review ? task.review.status : ''
  const { needs_attention } = task

  return (
    <div>
      <Button
        data-tip="Decline and remove Needs Attention notification"
        className="deal-button decline-comment"
        disabled={isSaving}
        onClick={() => onSendComment(false, 'Declined')}
      >
        { hasComment ? 'Decline & Comment' : 'Decline' }
      </Button>

      <Button
        data-tip="Approve and remove Needs Attention notification"
        className="deal-button approve-comment"
        disabled={isSaving}
        onClick={() => onSendComment(false, 'Approved')}
      >
        { hasComment ? 'Approve & Comment' : 'Approve' }
      </Button>

      <Button
        data-tip="Leaving a comment will notify the agent"
        className={cn('deal-button add-comment', {
          enabled: hasComment
        })}
        disabled={isSaving}
        onClick={() => onSendComment()}
      >
        Comment
      </Button>
    </div>
  )
}

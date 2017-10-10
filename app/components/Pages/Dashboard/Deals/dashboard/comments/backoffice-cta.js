import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

function getDeclineButtonCaption(status, hasComment) {
  if (!hasComment && status === 'Declined') {
    return (
      <span>
        <i className="fa fa-check" />&nbsp;
        Declined
      </span>
    )
  }

  return hasComment ? 'Decline & Comment' : 'Decline'
}

function getApproveButtonCaption(status, hasComment) {
  if (!hasComment && status === 'Approved') {
    return (
      <span>
        <i className="fa fa-check" />&nbsp;
        Approved
      </span>
    )
  }

  return hasComment ? 'Approve & Comment' : 'Approve'
}

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
  const isDeclined = (status === 'Declined')
  const isApproved = (status === 'Approved')
  return (
    <div>
      <Button
        data-tip={isDeclined ?
          'Click to undo' :
          'Decline and remove Needs Attention notification'
        }
        className="deal-button decline-comment"
        disabled={isSaving}
        onClick={() => onSendComment(isDeclined ? null : false, isDeclined ? 'Incomplete' : 'Declined')}
      >
        { getDeclineButtonCaption(status, hasComment) }
      </Button>

      <Button
        data-tip={isApproved ?
          'Click to undo' :
          'Approve and remove Needs Attention notification'
        }
        className="deal-button approve-comment"
        disabled={isSaving}
        onClick={() => onSendComment(isApproved ? null : false, isApproved ? 'Incomplete' : 'Approved')}
      >
        { getApproveButtonCaption(status, hasComment) }
      </Button>

      <Button
        data-tip="Leaving a comment will notify the agent"
        className={cn('deal-button add-comment', {
          enabled: hasComment
        })}
        disabled={isSaving}
        onClick={() => onSendComment(false)}
      >
        Comment
      </Button>
    </div>
  )
}

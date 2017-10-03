import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

let filters = []
const DECLINE = 0
const APPROVE = 1
const CLOSE_COMMENT = 2
const COMMENT = 3

function can(btn, isSaving = false) {
  return !isSaving && filters.indexOf(btn) > -1
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
  const needs_attention = task.needs_attention === true

  // see https://gitlab.com/rechat/web/issues/276
  if (status !== 'Submitted' && needs_attention === false) {
    filters = [COMMENT]
  }

  if (status !== 'Submitted' && needs_attention === true) {
    filters = [CLOSE_COMMENT, COMMENT]
  }

  if (status === 'Submitted' && needs_attention === false) {
    filters = [DECLINE, APPROVE, COMMENT]
  }

  if (status === 'Submitted' && needs_attention === true) {
    filters = [DECLINE, APPROVE, COMMENT]
  }

  return (
    <div>
      {
        can(DECLINE, isSaving) &&
        <Button
          className="deal-button decline-comment"
          disabled={isSaving}
          onClick={() => onSendComment(false, 'Declined')}
        >
          { hasComment ? 'Decline & Comment' : 'Decline' }
        </Button>
      }

      {
        can(APPROVE, isSaving) &&
        <Button
          data-tip="Leave a comment for the agent, and remove Needs Attention notification"
          className="deal-button approve-comment"
          disabled={isSaving}
          onClick={() => onSendComment(false, 'Approved')}
        >
          { hasComment ? 'Approve & Comment' : 'Approve' }
        </Button>
      }

      {
        can(CLOSE_COMMENT, isSaving) &&
        <Button
          className="deal-button close-comment"
          disabled={isSaving}
          onClick={() => onSendComment(false)}
        >
          { hasComment ? 'Comment & Close' : 'Close' }
        </Button>
      }

      <Button
        data-tip="Leaving a comment will notify the agent"
        className={cn('deal-button add-comment', {
          disabled: isSaving
        })}
        disabled={isSaving}
        onClick={() => onSendComment()}
      >
        Comment
      </Button>
    </div>
  )
}

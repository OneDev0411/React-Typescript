import React from 'react'
import ReactTooltip from 'react-tooltip'

let filters = []
const DECLINE = 0
const APPROVE = 1
const CLOSE_COMMENT = 2
const COMMENT = 3

function can(btn) {
  return filters.indexOf(btn) > -1
}

export default ({
  task,
  onSendComment,
  onDecline,
  onApprove,
  hasComment
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
    filters = [DECLINE, APPROVE]
  }

  if (status === 'Submitted' && needs_attention === true) {
    filters = [DECLINE, APPROVE, COMMENT]
  }

  return (
    <div>
      <ReactTooltip
        place="top"
        className="deal-filter--tooltip"
        multiline
      />

      {
        can(DECLINE) &&
        <button
          className="deal-button decline-comment"
          onClick={() => onSendComment(false, 'Declined')}
        >
          { hasComment ? 'Decline & Comment' : 'Decline' }
        </button>
      }

      {
        can(APPROVE) &&
        <button
          data-tip="Leave a comment for the agent, and remove Needs Attention notification"
          className="deal-button approve-comment"
          onClick={() => onSendComment(false, 'Approved')}
        >
          { hasComment ? 'Approve & Comment' : 'Approve' }
        </button>
      }

      {
        can(CLOSE_COMMENT) &&
        <button
          className="deal-button close-comment"
          onClick={() => onSendComment(false)}
        >
          { hasComment ? 'Comment & Close' : 'Close' }
        </button>
      }

      {
        can(COMMENT) &&
        <button
          data-tip="Leaving a comment will notify the agent"
          className="deal-button add-comment"
          onClick={() => onSendComment()}
        >
          Comment
        </button>
      }
    </div>
  )
}

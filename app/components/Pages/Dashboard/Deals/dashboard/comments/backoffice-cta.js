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
  const isNotReviewed = !isDeclined && !isApproved

  return (
    <div>
      {
        !isSaving ?
        <div className="inline">
          <span
            className={cn('cta-btn decline', {
              isActive: isDeclined
            })}
            data-tip={isDeclined ? 'Declined' : 'Decline'}
            data-effect="solid"
            onClick={() => onSendComment(needs_attention ? false : null, 'Declined')}
          >
            <i className="ico fa fa-times" />
          </span>

          <span
            className={cn('cta-btn approve', {
              isActive: isApproved
            })}
            data-tip={isApproved ? 'Approved' : 'Approve'}
            data-effect="solid"
            onClick={() => onSendComment(needs_attention ? false : null, 'Approved')}
          >
            <i className="ico fa fa-check" />
          </span>

          <span
            className={cn('cta-btn no-status', {
              isActive: isNotReviewed
            })}
            data-tip={isNotReviewed ? 'Not Reviewed' : 'Not Review'}
            data-effect="solid"
            onClick={() => onSendComment(needs_attention ? false : null, 'Incomplete')}
          >
            <span className="ico circle" />
          </span>
        </div> :
        <div className="loading inline">
          Saving <img src="/static/images/loading-states/three-dots-blue.svg" />
        </div>
      }

      <Button
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

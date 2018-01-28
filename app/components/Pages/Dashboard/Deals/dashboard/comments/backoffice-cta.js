import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import ToolTip from '../../components/tooltip'

export default ({
  task, onSendComment, hasComment, isSaving
}) => {
  const status = task.review ? task.review.status : ''
  const { needs_attention } = task
  const isDeclined = status === 'Declined'
  const isApproved = status === 'Approved'
  const isNotReviewed = !isDeclined && !isApproved

  return (
    <div>
      {!isSaving ? (
        <div className="inline">
          <ToolTip caption={isDeclined ? 'Declined' : 'Decline'}>
            <span
              className={cn('cta-btn decline', { isActive: isDeclined })}
              onClick={() =>
                onSendComment(needs_attention ? false : null, 'Declined')
              }
            >
              <i className="ico fa fa-times" />
            </span>
          </ToolTip>

          <ToolTip caption={isApproved ? 'Approved' : 'Approve'}>
            <span
              className={cn('cta-btn approve', { isActive: isApproved })}
              onClick={() =>
                onSendComment(needs_attention ? false : null, 'Approved')
              }
            >
              <i className="ico fa fa-check" />
            </span>
          </ToolTip>

          <ToolTip caption="Not Reviewed">
            <span
              className={cn('cta-btn no-status', {
                isActive: isNotReviewed && needs_attention !== true
              })}
              onClick={() =>
                onSendComment(needs_attention ? false : null, 'Incomplete')
              }
            >
              <span className="ico circle" />
            </span>
          </ToolTip>
        </div>
      ) : (
        <div className="loading inline">
          Saving
          <img
            alt="setting"
            src="/static/images/loading-states/three-dots-blue.svg"
          />
        </div>
      )}

      <Button
        className={cn('deal-button add-comment', {
          enabled: hasComment
        })}
        disabled={isSaving || !hasComment}
        onClick={() => onSendComment(false)}
      >
        Comment
      </Button>
    </div>
  )
}

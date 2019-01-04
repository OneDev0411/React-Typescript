import React from 'react'
import cn from 'classnames'
import ToolTip from 'views/components/tooltip/index'
import ActionButton from 'components/Button/ActionButton'

const BackOfficeCta = ({ task, onSendComment, hasComment, isSaving }) => {
  const status = task.review ? task.review.status : ''
  const { attention_requested } = task
  const isDeclined = !attention_requested && status === 'Declined'
  const isApproved = !attention_requested && status === 'Approved'
  const isNotReviewed = !isDeclined && !isApproved && !attention_requested

  return (
    <div>
      {!isSaving ? (
        <div className="inline">
          <ToolTip caption={isDeclined ? 'Declined' : 'Decline'}>
            <span
              className={cn('cta-btn decline', { isActive: isDeclined })}
              onClick={() =>
                onSendComment(attention_requested ? false : null, 'Declined')
              }
            >
              <i className="ico fa fa-times" />
            </span>
          </ToolTip>

          <ToolTip caption={isApproved ? 'Approved' : 'Approve'}>
            <span
              className={cn('cta-btn approve', { isActive: isApproved })}
              onClick={() =>
                onSendComment(attention_requested ? false : null, 'Approved')
              }
            >
              <i className="ico fa fa-check" />
            </span>
          </ToolTip>

          <ToolTip caption="Not Reviewed">
            <span
              className={cn('cta-btn no-status', {
                isActive: isNotReviewed && attention_requested !== true
              })}
              onClick={() =>
                onSendComment(attention_requested ? false : null, 'Incomplete')
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

      <ActionButton
        appearance="outline"
        disabled={isSaving || !hasComment}
        onClick={() => onSendComment(false)}
      >
        Comment
      </ActionButton>
    </div>
  )
}

export default BackOfficeCta

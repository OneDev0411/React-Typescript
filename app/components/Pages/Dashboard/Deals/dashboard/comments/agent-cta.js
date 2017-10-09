import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import SubmitReview from '../submit-review'

function getSubmitButtonLabel(isSaving, hasComment) {
  if (isSaving) {
    return (
      <span>
        <i className="fa fa-spin fa-spinner" />&nbsp;
        Submitting ...
      </span>
    )
  }

  return hasComment ? '' : 'Submit for review'
}

export default ({
  task,
  hasComment,
  isSaving,
  onSendComment
}) => (
  <div>
    {
      (hasComment || isSaving) &&
      <Button
        className="deal-button enabled notify-admin"
        disabled={isSaving}
        data-tip="Send your comment and admin will get notified immediately"
        onClick={() => onSendComment(true)}
      >
        Comment and notify admin
      </Button>
    }

    {
      !hasComment && !isSaving &&
      <SubmitReview
        task={task}
      />
    }
  </div>
)

import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

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
    <Button
      className="deal-button enabled notify-admin"
      disabled={isSaving}
      data-tip={hasComment ? null : 'Notify office to Review'}
      onClick={() => onSendComment(true)}
    >
      Notify Office
    </Button>
  </div>
)

import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import ToolTip from '../../components/tooltip'

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
  <ToolTip
    caption={hasComment ? null : 'Notify office to Review'}
  >
    <Button
      className="deal-button enabled notify-admin"
      disabled={isSaving}
      onClick={() => onSendComment(true)}
    >
      Notify Office
    </Button>
  </ToolTip>
)

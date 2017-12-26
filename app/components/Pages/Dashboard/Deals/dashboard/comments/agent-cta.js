import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import ToolTip from '../../components/tooltip'
import { confirmation } from '../../../../../../store_actions/confirmation'

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

const AgentCta = ({
  checklists,
  task,
  hasComment,
  isSaving,
  confirmation,
  onSendComment
}) => {
  const sendComment = function() {
    const isBackupChecklist = checklists[task.checklist].is_deactivated

    if (isBackupChecklist) {
      return confirmation({
        message: 'Sorry, can\'t send message',
        description: 'You can not Notify Office for Backup Offers.',
        confirmLabel: 'Okay, got it!',
        hideCancelButton: true
      })
    }

    onSendComment(true)
  }

  return (
    <ToolTip
      caption={hasComment ? null : 'Notify office to Review'}
    >
      <Button
        className="deal-button enabled notify-admin"
        disabled={isSaving}
        onClick={() => sendComment()}
      >
        Notify Office
      </Button>
    </ToolTip>
  )
}

export default connect(({ deals }) => ({
  checklists: deals.checklists
}), {
  confirmation
})(AgentCta)

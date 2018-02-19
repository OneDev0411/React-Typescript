import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import ToolTip from '../../components/tooltip'
import { confirmation } from '../../../../../../store_actions/confirmation'

function getSubmitButtonLabel(isSaving, hasComment) {
  if (isSaving) {
    return (
      <span>
        <i className="fa fa-spin fa-spinner" />&nbsp; Submitting ...
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
  function sendComment() {
    const isBackupChecklist = checklists[task.checklist].is_deactivated

    if (isBackupChecklist) {
      return confirmation({
        message: "Sorry, can't send message",
        description: 'You can not Notify Office for Backup Offers.',
        confirmLabel: 'Okay, got it!',
        hideCancelButton: true
      })
    }

    onSendComment(true)
  }

  function cancelNotify() {
    return confirmation({
      message: 'Cancel Notify Office?',
      description:
        'Your pending Notify Office request will be canceled for this task',
      confirmLabel: 'Yes, cancel',
      cancelLabel: 'No',
      onConfirm: () => onSendComment(false)
    })
  }

  return (
    <Fragment>
      {task.attention_requested && (
        <Button
          className="deal-button enabled add-comment second-color"
          disabled={isSaving}
          onClick={() => cancelNotify()}
        >
          Cancel Notify
        </Button>
      )}
      <ToolTip caption={hasComment ? null : 'Notify office to Review'}>
        <Button
          className="deal-button enabled add-comment notify-admin"
          disabled={isSaving}
          onClick={() => sendComment()}
        >
          Notify Office
        </Button>
      </ToolTip>
    </Fragment>
  )
}

export default connect(
  ({ deals }) => ({
    checklists: deals.checklists
  }),
  {
    confirmation
  }
)(AgentCta)

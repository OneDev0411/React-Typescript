import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import ToolTip from '../../../../../../views/components/tooltip/index'
import { confirmation } from '../../../../../../store_actions/confirmation'
import ActionButton from 'components/Button/ActionButton'

const CancelButton = ActionButton.extend`
  margin-right: 1em;
  color: #f6a623;
  border-color: #f6a623;
`
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
        message: 'Sorry, can\'t send message',
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
        <CancelButton
          appearance="outline"
          disabled={isSaving}
          onClick={() => cancelNotify()}
        >
          Cancel Notify
        </CancelButton>
      )}
      <ToolTip caption={hasComment ? null : 'Notify office to Review'}>
        <ActionButton disabled={isSaving} onClick={() => sendComment()}>
          Notify Office
        </ActionButton>
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

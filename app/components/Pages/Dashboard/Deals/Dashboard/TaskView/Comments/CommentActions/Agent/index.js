import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import ToolTip from 'components/tooltip'
import { confirmation } from 'actions/confirmation'
import ActionButton from 'components/Button/ActionButton'

class Agent extends React.Component {
  sendComment = () => {
    const isBackupChecklist = this.props.checklists[this.props.task.checklist]
      .is_deactivated

    if (isBackupChecklist) {
      return this.props.confirmation({
        message: 'Sorry, can not send message',
        description: 'You can not Notify Office for Backup Offers.',
        confirmLabel: 'Okay, got it!',
        hideCancelButton: true
      })
    }

    this.props.onSendComment(true)
  }

  cancelNotify = () =>
    this.props.confirmation({
      message: 'Cancel Notify Office?',
      description:
        'Your pending Notify Office request will be canceled for this task',
      confirmLabel: 'Yes, cancel',
      cancelLabel: 'No',
      onConfirm: () => this.props.onSendComment(false, 'Incomplete')
    })

  render() {
    const isSendDisabled =
      this.props.task.task_type === 'GeneralComments' &&
      this.props.hasComment === false

    return (
      <Fragment>
        <ToolTip
          caption={this.props.hasComment ? null : 'Notify office to Review'}
        >
          <ActionButton
            disabled={this.props.isSaving || isSendDisabled}
            onClick={this.sendComment}
          >
            {this.props.isSaving ? 'Saving...' : 'Notify Office'}
          </ActionButton>
        </ToolTip>

        {this.props.task.attention_requested && (
          <ActionButton
            appearance="outline"
            style={{
              borderColor: '#f6a623',
              color: '#f6a623'
            }}
            disabled={this.props.isSaving}
            onClick={this.cancelNotify}
          >
            {this.props.isSaving ? 'Processing...' : 'Cancel Notify'}
          </ActionButton>
        )}
      </Fragment>
    )
  }
}

export default connect(
  ({ deals }) => ({
    checklists: deals.checklists
  }),
  {
    confirmation
  }
)(Agent)

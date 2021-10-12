import React from 'react'

import { Button, Tooltip } from '@material-ui/core'
import { connect } from 'react-redux'

import { confirmation } from 'actions/confirmation'

class Agent extends React.Component {
  sendComment = () => {
    const isBackupChecklist =
      this.props.checklists[this.props.task.checklist].is_deactivated

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
      <>
        <Tooltip title={this.props.hasComment ? '' : 'Notify office to Review'}>
          <Button
            color="secondary"
            variant="contained"
            disabled={this.props.isSaving || isSendDisabled}
            onClick={this.sendComment}
          >
            {this.props.isSaving ? 'Saving...' : 'Notify Office'}
          </Button>
        </Tooltip>

        {this.props.task.attention_requested && (
          <Button
            color="secondary"
            variant="outlined"
            style={{
              borderColor: '#f6a623',
              color: '#f6a623'
            }}
            disabled={this.props.isSaving}
            onClick={this.cancelNotify}
          >
            {this.props.isSaving ? 'Processing...' : 'Cancel Notify'}
          </Button>
        )}
      </>
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

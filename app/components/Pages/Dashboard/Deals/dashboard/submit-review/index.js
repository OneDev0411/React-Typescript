import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { batchActions } from 'redux-batched-actions'
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap'
import { changeTaskStatus, changeNeedsAttention } from '../../../../../../store_actions/deals'

class SubmitReview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      submitting: false
    }
  }

  async toggleSubmit() {
    const { task, submitting, changeTaskStatus, changeNeedsAttention, notify } = this.props
    const status = this.getTaskStatus()

    if (submitting) {
      return false
    }

    this.setState({ submitting: true })

    // submit this task to review
    const newStatus = (status === 'Submitted') ? 'Incomplete' : 'Submitted'

    try {
      batchActions([
        await changeTaskStatus(task.id, newStatus),
        await changeNeedsAttention(task.id, newStatus === 'Submitted')
      ])

      notify({
        dismissible: true,
        message: (newStatus === 'Submitted') ?
          'Submitted for review!' :
          'Submission cancelled!',
        status: 'success'
      })

    } catch(e) {
      console.log(e)
      notify({
        title: 'Error',
        message: 'Can not complete your request, please try again.',
        status: 'error'
      })
    }

    this.setState({
      submitting: false
    })
  }

  getTaskStatus() {
    const { task } = this.props
    return task.review && task.review.status
  }

  getButtonCaption() {
    const { submitting } = this.state
    const status = this.getTaskStatus()

    if (submitting) {
      return 'Working ...'
    }

    return status === 'Submitted' ? 'Cancel Submission' : 'Submit'
  }

  getButtonTip() {
    const status = this.getTaskStatus()
    return status === 'Submitted' ? 'Cancel submitting to back office' : 'Submit to back office'
  }

  render() {
    const { submitting } = this.state
    const { task } = this.props
    const status = this.getTaskStatus()

    return (
      <div>
        <button
          disabled={submitting}
          onClick={() => this.toggleSubmit()}
          data-tip={this.getButtonTip()}
          className={`task-btn btn-submit ${submitting ? 'saving' : ''}`}
          style={{ fontSize: 'Submitted' ? '13px' : '15px' }}
        >
          { this.getButtonCaption() }
        </button>

      </div>
    )
  }
}

export default connect(null, {
  changeTaskStatus,
  changeNeedsAttention,
  notify
})(SubmitReview)

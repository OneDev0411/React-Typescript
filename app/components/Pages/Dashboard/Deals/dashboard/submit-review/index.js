import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { batchActions } from 'redux-batched-actions'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
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
    const submitted = this.isTaskSubmitted()

    if (submitting) {
      return false
    }

    this.setState({ submitting: true })

    // submit this task to review
    const newStatus = submitted ? 'Incomplete' : 'Submitted'

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

  isTaskSubmitted() {
    const { task } = this.props
    return task.needs_attention || (task.review && task.review.status)
  }

  getButtonCaption() {
    const { submitting } = this.state
    const submitted = this.isTaskSubmitted()

    if (submitting) {
      return 'Working ...'
    }

    return submitted ? 'Cancel Submission' : 'Submit for review'
  }

  getButtonTip() {
    return this.isTaskSubmitted() ?
      'Cancel submitting to back office' :
      'Submit to back office'
  }

  render() {
    const { submitting } = this.state

    return (
      <Button
        disabled={submitting}
        onClick={() => this.toggleSubmit()}
        data-tip={this.getButtonTip()}
        className="deal-button submit-review enabled"
      >
        { this.getButtonCaption() }
      </Button>
    )
  }
}

export default connect(null, {
  changeTaskStatus,
  changeNeedsAttention,
  notify
})(SubmitReview)

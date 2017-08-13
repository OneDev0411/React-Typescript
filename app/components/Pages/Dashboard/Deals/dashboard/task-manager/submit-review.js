import React from 'react'
import { connect } from 'react-redux'
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap'
import MessageModal from '../../../../../Partials/MessageModal'
import { submitForReview, cancelTaskReview } from '../../../../../../store_actions/deals'

class SubmitReview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      submitting: false,
      showSuccessModal: false
    }
  }

  async toggleSubmit() {
    const { task, submitting, submitForReview, cancelTaskReview } = this.props
    const status = this.getTaskStatus()

    if (submitting) {
      return false
    }

    this.setState({ submitting: true })

    // submit this task to review
    if (status === 'Pending') {
      await cancelTaskReview(task.id)
    } else {
      await submitForReview(task.id)
    }

    this.setState({
      showSuccessModal: true,
      submitting: false
    })

    setTimeout(() => this.setState({ showSuccessModal: false }), 3000)
  }

  getTaskStatus() {
    const { task } = this.props
    return task.review && task.review.status
  }

  getButtonCaption() {
    const { submitting } = this.state
    const status = this.getTaskStatus()

    if (submitting) {
      return <img src="/static/images/deals/pacman.svg" />
    }

    return status === 'Pending' ? 'Cancel Submission' : 'Submit'
  }

  render() {
    const { submitting, showSuccessModal } = this.state
    const { task } = this.props
    const status = this.getTaskStatus()

    return (
      <div style={{ display: 'inline' }}>
        <button
          disabled={submitting}
          onClick={() => this.toggleSubmit()}
          className={`task-btn btn-submit ${submitting ? 'saving' : ''}`}
        >
          { this.getButtonCaption() }
        </button>

        <MessageModal
          show={showSuccessModal}
          text={status === 'Pending' ? 'Submitted for review!' : 'Submission cancelled!'}
        />
      </div>
    )
  }
}

export default connect(null,
  { submitForReview, cancelTaskReview })(SubmitReview)

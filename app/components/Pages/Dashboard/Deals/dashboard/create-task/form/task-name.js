import React, { Component } from 'react'
import Alert from '../../../../Partials/Alert'
import { Modal, Button } from 'react-bootstrap'

class NewTaskModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: null
    }

    this.setTitle = this.setTitle.bind(this)
  }

  setTitle(event) {
    this.setState({
      title: event.target.value
    })
  }

  render() {
    const {
      show, onClose, onCreateNewTask, isCreatingTask, isFailed
    } = this.props
    const { title } = this.state

    return (
      <Modal
        dialogClassName="c-new-task-modal"
        show={show}
        onHide={onClose}
        backdrop="static"
      >
        <Modal.Header closeButton>Custom Task</Modal.Header>

        <Modal.Body>
          <span className="label">Title</span>
          <input type="text" readOnly={isCreatingTask} onChange={this.setTitle} />

          <span className="note">
            Accurate titles help with context when glancing through your checklist.
          </span>
        </Modal.Body>

        <Modal.Footer>
          {isFailed && (
            <Alert
              code={500}
              type="error"
              style={{
                textAlign: 'left',
                margin: '0 0 1rem'
              }}
              supportHandler={onClose}
            />
          )}

          <Button
            bsStyle="primary"
            className="c-new-task-modal__submit-btn"
            disabled={isCreatingTask || !title}
            onClick={() => onCreateNewTask(title)}
          >
            {isCreatingTask ? 'Creating Task ...' : 'Create Task'}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default NewTaskModal

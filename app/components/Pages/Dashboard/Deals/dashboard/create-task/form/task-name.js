import React, { Component } from 'react'
import Alert from '../../../../Partials/Alert'
import { Modal, Button } from 'react-bootstrap'

class NewTaskModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: ''
    }
  }

  setTitle(title) {
    this.setState({
      title
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
        <Modal.Header closeButton>Create New Task</Modal.Header>

        <Modal.Body>
          <span className="label">Title</span>
          <input
            type="text"
            readOnly={isCreatingTask}
            onChange={e => this.setTitle(e.target.value)}
          />

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
            disabled={isCreatingTask || title.length === 0}
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

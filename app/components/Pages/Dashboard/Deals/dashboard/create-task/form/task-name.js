import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default ({
  show, onClose, onCreateNewTask, isCreatingTask, isFailed
}) => (
  <Modal
    dialogClassName="modal-deal-create-form-task-name"
    show={show}
    onHide={onClose}
    backdrop="static"
  >
    <Modal.Header closeButton>Name Task</Modal.Header>

    <Modal.Body>
      <span className="label">Title</span>
      <input type="text" ref={ref => (this.input = ref)} readOnly={isCreatingTask} />

      <span className="note">
        Accurate titles help with context when glancing through your checklist.
      </span>
    </Modal.Body>

    <Modal.Footer>
      {isFailed && (
        <div
          className="c-alert c-alert--error"
          style={{
            textAlign: 'left',
            margin: '0 0 1rem'
          }}
        >
          Sorry, something went wrong. Please try again.
        </div>
      )}

      <Button
        bsStyle="primary"
        disabled={isCreatingTask}
        onClick={() => onCreateNewTask(this.input.value)}
      >
        {isCreatingTask ? 'Creating Task ...' : 'Create Task'}
      </Button>
    </Modal.Footer>
  </Modal>
)

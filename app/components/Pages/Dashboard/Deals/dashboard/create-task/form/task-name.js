import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import {
  createFormTask,
  setSelectedTask,
  setUploadFiles
} from '../../../../../../../store_actions/deals'

const TaskName = ({
  show,
  onClose,
  addTaskName,
  isCreatingTask
}) => (
  <Modal
    dialogClassName="modal-deal-create-form-task-name"
    show={show}
    onHide={onClose}
    backdrop="static"
  >
    <Modal.Header closeButton>
          Name Task
    </Modal.Header>

    <Modal.Body>
      <span className="label">Title</span>
      <input
        type="text"
        ref={input => this.input = input}
      />

      <span className="note">
            Accurate titles help with context when glancing through your checklist.
      </span>
    </Modal.Body>

    <Modal.Footer>
      <Button
        bsStyle="primary"
        onClick={() => {
          addTaskName(this.input.value)
        }}
      >
        {isCreatingTask ? 'Creating Task ...' : 'Create Task'}
      </Button>
    </Modal.Footer>
  </Modal>
)

export default connect(null, {
  createFormTask,
  setSelectedTask,
  setUploadFiles
})(TaskName)

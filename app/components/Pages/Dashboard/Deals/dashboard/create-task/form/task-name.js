import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createTask } from '../../../../../../../store_actions/deals'
import ChatModel from '../../../../../../../models/Chatroom'
import { addAttachment } from '../../../../../../../store_actions/deals'

class TaskName extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      status: null
    }
  }

  async create() {
    const { file, createTask, listId, dealId, addAttachment, onClose } = this.props
    const { title } = this.state

    if (title.length === 0 || !file) {
      return false
    }

    // change status
    this.setState({ status: 'Creating task' })

    try {
      // create task
      const task = await createTask(dealId, null, title, 'Incomplete', 'Form', listId)

      // change status
      this.setState({ status: 'Uploading file' })

      // upload file
      const uploaded = await this.uploadFile(task.room.id, file)

      // add attachment to the list
      addAttachment(task.deal, task.checklist, task.id, uploaded)

    } catch(e) {
      // todo
    } finally {
      this.setState({
        status: null,
        title: ''
      }, onClose)
    }
  }

  /**
   * upload a file to room
   */
  async uploadFile(roomId, file) {
    try {
      const response = await ChatModel.uploadAttachment(roomId, file)
      return response.body.data
    } catch(e) {
      return null
    }
  }

  render() {
    const { show, onClose } = this.props
    const { title, status } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        dialogClassName="modal-deal-create-form-task-name"
      >
        <Modal.Header closeButton>
          <Modal.Title>Name Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <span className="label">Title</span>
          <input
            type="text"
            value={title}
            onChange={e => this.setState({ title: e.target.value })}
          />

          <span className="note">
            Accurate titles help with context when glancing through your checklist.
          </span>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            disabled={status !== null}
            onClick={() => this.create()}
          >
            { status || 'Upload' }
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect(null, { createTask, addAttachment })(TaskName)

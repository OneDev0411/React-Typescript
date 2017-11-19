import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createFormTask, setSelectedTask,
  addAttachment } from '../../../../../../../store_actions/deals'
import ChatModel from '../../../../../../../models/Chatroom'

class TaskName extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      status: null
    }
  }

  async create() {
    const { file, createFormTask, setSelectedTask, listId, dealId,
      addAttachment, onClose } = this.props

    const { title, status } = this.state

    if (title.length === 0 || !file || status !== null) {
      return false
    }

    // change status
    this.setState({ status: 'Creating task' })

    try {
      // create task
      const task = await createFormTask(dealId, null, title, listId)

      // change status
      this.setState({ status: 'Uploading file' })

      // upload file
      const uploaded = await this.uploadFile(task.room.id, file)

      // add attachment to the list
      addAttachment(task.deal, task.checklist, task.id, uploaded)

      // make task active
      setSelectedTask(task)

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

export default connect(null, {
  createFormTask, setSelectedTask, addAttachment })(TaskName)

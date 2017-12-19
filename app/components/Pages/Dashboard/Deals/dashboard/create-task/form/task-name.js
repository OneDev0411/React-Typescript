import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import {
  createFormTask,
  setSelectedTask,
  setUploadFiles
} from '../../../../../../../store_actions/deals'

class TaskName extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      isCreatingTask: false
    }
  }

  async create() {
    const { files, createFormTask, setSelectedTask, listId, deal,
      onClose, setUploadFiles } = this.props

    const { title, isCreatingTask } = this.state

    if (isCreatingTask || title.length === 0 || files.length === 0) {
      return false
    }

    // change status
    this.setState({ isCreatingTask: true })

    try {
      // create task
      const task = await createFormTask(deal.id, null, title, listId)

      // make task active
      setSelectedTask(task)

      // upload file
      setUploadFiles(files, deal, task)
    } catch (e) {
      // todo
    } finally {
      this.setState({
        isCreatingTask: false,
        title: ''
      }, onClose)
    }
  }

  render() {
    const { show, onClose } = this.props
    const { title, isCreatingTask } = this.state

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
            disabled={isCreatingTask}
            onClick={() => this.create()}
          >
            { isCreatingTask ? 'Creating Task ...' : 'Create Task' }
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect(null, {
  createFormTask, setSelectedTask, setUploadFiles })(TaskName)

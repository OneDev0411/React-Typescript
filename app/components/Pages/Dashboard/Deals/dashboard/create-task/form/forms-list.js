import React from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import Dropzone from 'react-dropzone'
import Deal from '../../../../../../../models/Deal'
import {
  createFormTask,
  setSelectedTask,
  setUploadFiles
} from '../../../../../../../store_actions/deals'
import TaskName from './task-name'

class Forms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      isCreatingTask: null,
      showNewTaskModal: false,
      newTaskTitle: '',
      createTaskIsFailed: false
    }
  }

  async createTask(form) {
    const {
      deal,
      createFormTask,
      setSelectedTask,
      onClose,
      onTaskCreate,
      listId
    } = this.props

    if (this.lockedTaskCreation) {
      return false
    }

    // lock
    this.lockedTaskCreation = true

    this.setState({
      createTaskIsFailed: false,
      isCreatingTask: form.isNew || form
    })

    try {
      // create form
      const task = await createFormTask(deal.id, form.id, form.name, listId)

      // make this task active
      setSelectedTask(task)

      this.setState({ isCreatingTask: null })
      this.lockedTaskCreation = false

      if (onClose) {
        onClose()
      }

      if (onTaskCreate) {
        onTaskCreate(task)
      }

      return task
    } catch (error) {
      this.setState({ createTaskIsFailed: true, isCreatingTask: null })

      return false
    }
  }

  async createNewTask(taskName) {
    // open file select modal
    this.dropzone.open()

    // hide modal
    this.setState({ newTaskTitle: taskName })
  }

  showNewTaskModal() {
    this.setState({ showNewTaskModal: true })
    this.props.onClose()
  }

  async onDropFiles(files) {
    const { newTaskTitle } = this.state

    const form = {
      isNew: true,
      id: null,
      name: newTaskTitle
    }

    // create task
    const task = await this.createTask(form)

    if (task) {
      this.setState({
        newTaskTitle: '',
        showNewTaskModal: false
      })

      this.props.setUploadFiles(files, task)
    }
  }

  render() {
    const { forms, show, onClose, allowCustomTask } = this.props
    const { filter, showNewTaskModal, isCreatingTask } = this.state

    return (
      <div>
        <Modal
          show={show}
          onHide={onClose}
          backdrop="static"
          dialogClassName="modal-deal-create-form"
          style={{
            zIndex: 2000
          }}
        >
          <Modal.Header closeButton={isCreatingTask === null}>
            Add Task
          </Modal.Header>

          <Modal.Body>
            {_.size(forms) > 5 && (
              <input
                placeholder="Type in to search ..."
                onChange={e => this.setState({ filter: e.target.value })}
              />
            )}

            <ul>
              {_.chain(forms)
                .filter(form =>
                  form.name.toLowerCase().includes(filter.toLowerCase())
                )
                .map((form, key) => (
                  <li
                    key={`FORM_ITEM_${form.id}_${key}`}
                    onClick={() => this.createTask(form)}
                    onDoubleClick={() => null}
                    className={cn({ disabled: isCreatingTask !== null })}
                  >
                    {form.name}

                    {isCreatingTask &&
                      isCreatingTask.id === form.id && (
                        <i className="fa fa-spinner fa-spin" />
                      )}
                  </li>
                ))
                .value()}
            </ul>
          </Modal.Body>

          {allowCustomTask && (
            <Modal.Footer>
              <ul>
                <li className="upload">
                  <div onClick={() => this.showNewTaskModal()}>
                    <i className="fa fa-plus" /> Other
                  </div>
                </li>
              </ul>
            </Modal.Footer>
          )}
        </Modal>

        <TaskName
          show={showNewTaskModal}
          onClose={() => this.setState({ showNewTaskModal: false })}
          isCreatingTask={isCreatingTask}
          isFailed={this.state.createTaskIsFailed}
          onCreateNewTask={name => this.createNewTask(name)}
        />

        <Dropzone
          disableClick
          ref={ref => (this.dropzone = ref)}
          onDrop={files => this.onDropFiles(files)}
          multiple
          accept={Deal.upload.getAcceptedDocuments()}
          style={{ display: 'none' }}
        />
      </div>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    forms: deals.checklists[props.listId].allowed_forms
  }
}

export default connect(mapStateToProps, {
  createFormTask,
  setSelectedTask,
  setUploadFiles
})(Forms)

import React from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import TaskName from './task-name'
import {
  createFormTask,
  setSelectedTask,
  setUploadFiles
} from '../../../../../../../store_actions/deals'

class Forms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      showTaskNameModal: false,
      taskName: '',
      isCreatingTask: false,
      creatingForm: null
    }
    this.createNewTask = _.debounce(this.createNewTask, 100)
  }

  async createNewTask(form) {
    if (this.state.creatingForm !== null) {
      return false
    }

    this.setState({
      creatingForm: form
    })

    const { deal, createFormTask, setSelectedTask, listId } = this.props

    // create form
    const task = await createFormTask(deal.id, form.id, form.name, listId)

    // make this task active
    setSelectedTask(task)

    this.setState({ creatingForm: null })
    this.displayForm(false)
  }

  getDataTransferItems(event) {
    let dataTransferItemsList = []

    if (event.dataTransfer) {
      const dt = event.dataTransfer

      if (dt.files && dt.files.length) {
        dataTransferItemsList = dt.files
      } else if (dt.items && dt.items.length) {
        // During the drag even the dataTransfer.files is null
        // but Chrome implements some drag store, which is accessible via dataTransfer.items
        dataTransferItemsList = dt.items
      }
    } else if (event.target && event.target.files) {
      dataTransferItemsList = event.target.files
    }

    // Convert from DataTransferItemsList to the native Array
    return Array.prototype.slice.call(dataTransferItemsList)
  }

  create = async (evt) => {
    const {
      createFormTask,
      setSelectedTask,
      listId,
      deal,
      setUploadFiles,
      onClose,
      notify
    } = this.props
    const { isCreatingTask } = this.state
    const { taskName } = this
    const files = this.getDataTransferItems(evt)

    if (isCreatingTask || taskName.length === 0 || files.length === 0) {
      return false
    }

    // change status
    this.setState({ isCreatingTask: true })

    try {
      // create task
      const task = await createFormTask(deal.id, null, taskName, listId)

      // make task active
      setSelectedTask(task)

      // upload file
      setUploadFiles(files, deal, task)
    } catch (e) {
      notify({
        message: e.message,
        status: 'error'
      })
    } finally {
      this.setState({
        isCreatingTask: false,
        showTaskNameModal: false
      }, () => onClose())
    }
  }


  render() {
    const {
      forms,
      show,
      onClose
    } = this.props
    const {
      filter,
      showTaskNameModal,
      isCreatingTask,
      creatingForm
    } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        backdrop="static"
        dialogClassName="modal-deal-create-form"
      >
        <Modal.Header
          closeButton={creatingForm === null}
        >
          {creatingForm ? 'Creating Task ...' : 'Add Task'}
        </Modal.Header>

        <Modal.Body>
          {
            _.size(forms) > 5 &&
            <input
              placeholder="Type in to search ..."
              onChange={e => this.setState({ filter: e.target.value })}
            />
          }

          <ul>
            {
              _
                .chain(forms)
                .filter(form => form.name.toLowerCase().includes(filter.toLowerCase()))
                .map((form, key) => (
                  <li
                    key={`FORM_ITEM_${form.id}_${key}`}
                    onClick={() => this.createNewTask(form)}
                    onDoubleClick={() => null}
                    className={cn({ disabled: creatingForm !== null })}
                  >
                    {form.name}

                    {
                      creatingForm && creatingForm.id === form.id &&
                      <i className="fa fa-spinner fa-spin" />
                    }
                  </li>
                ))
                .value()
            }
          </ul>

          <label>
            <input
              type="file"
              style={{ display: 'none', height: 0, width: 0 }}
              ref={input => this.formNewTaskFileInputEl = input}
              onChange={this.create}
            />
          </label>
        </Modal.Body>

        <Modal.Footer>
          <ul>
            <li className="upload">

              <TaskName
                show={showTaskNameModal}
                onClose={() => this.setState({ showTaskNameModal: false })}
                isCreatingTask={isCreatingTask}
                addTaskName={(taskName) => {
                  this.taskName = taskName
                  this.formNewTaskFileInputEl.click()
                }}
              />
              <div onClick={() => this.setState({
                showTaskNameModal: true
              })}
              >
                <i className="fa fa-plus" /> Other
              </div>
            </li>
          </ul>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    forms: deals.checklists[props.listId].allowed_forms
  }
}

export default connect(mapStateToProps,
  {
    createFormTask,
    setSelectedTask,
    setUploadFiles,
    notify
  }
)(Forms)

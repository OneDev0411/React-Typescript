import React from 'react'
import Forms from './forms-list'
import TaskName from './task-name'
import {
  createFormTask,
  setSelectedTask,
  setUploadFiles
} from '../../../../../../../store_actions/deals'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFormsModal: false,
      showTaskNameModal: false,
      isCreatingTask: false,
      taskName: ''
    }
  }

  /**
   *
   */
  displayForm = (status) => {
    this.setState({ showFormsModal: status })
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
      notify
    } = this.props
    const {
      taskName,
      isCreatingTask
    } = this.state
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
        showFormsModal: false,
        showTaskNameModal: false,
        isCreatingTask: false
      })
    }
  }

  render() {
    const {
      showFormsModal,
      showTaskNameModal,
      isCreatingTask
    } = this.state
    const {
      deal,
      listId
    } = this.props
    console.table({
      listId,
      showFormsModal,
      showTaskNameModal,
      isCreatingTask
    })
    return (
      <div
      >
        <div
          className="add-task form-task"
          onClick={() => this.displayForm(true)}
        >
          <div className="icon">
            <img
              className="img-add"
              src="/static/images/deals/plus.svg"
            />
          </div>

          <div className="title">
            Add checklist item
          </div>
        </div>
        <Forms
          show={showFormsModal}
          displayTaskName={() => this.setState({
            showTaskNameModal: true,
            showFormsModal: false
          })}
          deal={deal}
          listId={listId}
          onNew
          onClose={() => this.displayForm(false)}
        />
        <TaskName
          show={showTaskNameModal}
          onClose={() => this.setState({ showTaskNameModal: false })}
          isCreatingTask={isCreatingTask}
          addTaskName={(taskName) => {
            this.setState({ taskName })
            this.formNewTaskFileInputEl.click()
            console.log('taskName: ', taskName)
          }}
        />
        <input
          type="file"
          style={{ display: 'none', height: 0, width: 0 }}
          ref={input => this.formNewTaskFileInputEl = input}
          onChange={this.create}
        />
      </div>
    )
  }
}

export default connect(null,
  {
    createFormTask,
    setSelectedTask,
    setUploadFiles,
    notify
  }
)(CreateForm)
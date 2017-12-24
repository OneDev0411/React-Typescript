import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  createFormTask,
  setSelectedTask,
  setUploadFiles
} from '../../../../../../../store_actions/deals'
import Forms from './forms-list'

class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creatingForm: null,
      selectedFiles: null,
      showFormsModal: false,
      isCreatingTask: false,
      hideTaskName: false
    }

    this.createNewTask = _.debounce(this.createNewTask, 100)
  }

  /**
   *
   */
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

  /**
   *
   */
  onNewTask(file) {
    this.setState({
      selectedFiles: file,
      showFormsModal: false
    })
  }

  /**
   *
   */
  displayForm(status) {
    this.setState({ showFormsModal: status })
  }

  addTaskName = (taskName) => {
    this.taskName = taskName
    this.formNewTaskFileInputEl.click()
  }
  onSelectFile(files) {
    if (this.creatingForm !== null || files.length === 0) {
      return false
    }

    this.onNewTask(files)
  }

  getDataTransferItems(event) {
    let dataTransferItemsList = []

    if (event.dataTransfer) {
      const dt = event.dataTransfer

      if (dt.files && dt.files.length) {
        dataTransferItemsList = dt.files
      } else if (dt.items && dt.items.length) {
        // During the drag even the dataTransfer.files is null
        // but Chrome implements some drag store, which is accesible via dataTransfer.items
        dataTransferItemsList = dt.items
      }
    } else if (event.target && event.target.files) {
      dataTransferItemsList = event.target.files
    }

    // Convert from DataTransferItemsList to the native Array
    return Array.prototype.slice.call(dataTransferItemsList)
  }

  create = async (evt) => {
    const { createFormTask, setSelectedTask, listId, deal,
      setUploadFiles } = this.props
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
      // setUploadFiles(files, deal, task)
    } catch (e) {
      console.log('e: ', e)
    } finally {
      this.setState({
        isCreatingTask: false,
      }, () => this.displayForm(false))
    }
  }

  render() {
    const {
      creatingForm,
      selectedFiles,
      showFormsModal,
      isCreatingTask
    } = this.state
    const {
      deal,
      listId,
      forms
    } = this.props

    return (
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
        <label>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={input => this.formNewTaskFileInputEl = input}
            onChange={this.create}
          />
        </label>
        <Forms
          show={showFormsModal}
          deal={deal}
          forms={forms}
          listId={listId}
          creatingForm={creatingForm}
          addTaskName={this.addTaskName}
          selectedFiles={selectedFiles}
          onSelectForm={form => this.createNewTask(form)}
          onNew
          Task={file => this.onNewTask(file)}
          isCreatingTask={isCreatingTask}
          onClose={() => this.displayForm(false)}
        />
      </div>
    )
  }
}

export default connect(
  null, {
    createFormTask,
    setSelectedTask,
    setUploadFiles
  }
)(CreateForm)

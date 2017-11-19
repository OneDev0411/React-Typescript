import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import _ from 'underscore'
import { createFormTask, setSelectedTask } from '../../../../../../../store_actions/deals'
import Forms from './list'
import TaskName from './task-name'

class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creatingForm: null,
      selectedFile: null,
      showFormsModal: false,
      showUploadNameModal: false
    }
  }

  /**
   *
   */
  async createNewTask(form) {
    const { dealId, createFormTask, setSelectedTask, listId } = this.props

    if (this.state.creatingForm !== null) {
      return false
    }

    this.setState({ creatingForm: form })

    // create form
    const task = await createFormTask(dealId, form.id, form.name, listId)

    // make this task active
    setSelectedTask(task)

    this.setState({ creatingForm: null }, () => {
      this.displayForm(false)
    })
  }

  /**
   *
   */
  onRequestUpload(file) {
    this.setState({
      selectedFile: file,
      showFormsModal: false,
      showTaskNameModal: true
    })
  }

  /**
   *
   */
  displayForm(status) {
    this.setState({ showFormsModal: status })
  }

  render() {
    const {
      creatingForm,
      selectedFile,
      showFormsModal,
      showTaskNameModal
    } = this.state

    const { dealId, listId, forms } = this.props

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
          Add new item (documents, tasks, ...)
        </div>

        <TaskName
          show={showTaskNameModal}
          dealId={dealId}
          listId={listId}
          file={selectedFile}
          onClose={() => this.setState({ showTaskNameModal: false })}
        />

        <Forms
          show={showFormsModal}
          listId={listId}
          creatingForm={creatingForm}
          onSelectForm={form => this.createNewTask(form)}
          onRequestUpload={file => this.onRequestUpload(file)}
          onClose={() => this.displayForm(false)}
        />
      </div>
    )
  }
}

export default connect(null, { createFormTask, setSelectedTask })(CreateForm)

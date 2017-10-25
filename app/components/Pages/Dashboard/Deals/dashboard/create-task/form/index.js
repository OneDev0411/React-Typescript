import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import _ from 'underscore'
import { createFormTask } from '../../../../../../../store_actions/deals'
import Forms from './list'
import TaskName from './task-name'

class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFile: null,
      showFormsModal: false,
      showUploadNameModal: false
    }
  }

  /**
   *
   */
  createNewTask(form) {
    const { dealId, createFormTask, listId } = this.props

    // hide form
    this.displayForm(false)

    // create form
    createFormTask(dealId, form.id, form.name, listId)
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
    const { selectedFile, showFormsModal, showTaskNameModal } = this.state
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
          Add new item (Documents, tasks, ...)
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
          onSelectForm={form => this.createNewTask(form)}
          onRequestUpload={file => this.onRequestUpload(file)}
          onClose={() => this.displayForm(false)}
        />
      </div>
    )
  }
}

export default connect(null, { createFormTask })(CreateForm)

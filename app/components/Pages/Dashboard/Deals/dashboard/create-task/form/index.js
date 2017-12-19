import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import _ from 'underscore'
import { createFormTask, setSelectedTask } from '../../../../../../../store_actions/deals'
import Forms from './forms-list'
import TaskName from './task-name'

class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creatingForm: null,
      selectedFiles: null,
      showFormsModal: false,
      showUploadNameModal: false
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
    const { creatingForm, selectedFiles, showFormsModal, showTaskNameModal } = this.state
    const { deal, listId, forms } = this.props

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

        <TaskName
          show={showTaskNameModal}
          deal={deal}
          listId={listId}
          files={selectedFiles}
          onClose={() => this.setState({ showTaskNameModal: false })}
        />

        <Forms
          show={showFormsModal}
          deal={deal}
          listId={listId}
          creatingForm={creatingForm}
          onSelectForm={form => this.createNewTask(form)}
          onNewTask={file => this.onNewTask(file)}
          onClose={() => this.displayForm(false)}
        />
      </div>
    )
  }
}

export default connect(null, { createFormTask, setSelectedTask })(CreateForm)

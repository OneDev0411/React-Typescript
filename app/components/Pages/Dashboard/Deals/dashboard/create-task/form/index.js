import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import Forms from './forms-list'
import {
  createFormTask,
  setSelectedTask,
  setUploadFiles
} from '../../../../../../../store_actions/deals'

class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFormsModal: false
    }
  }

  /**
   *
   */
  displayForms(status) {
    this.setState({ showFormsModal: status })
  }

  render() {
    const { showFormsModal } = this.state
    const { deal, listId } = this.props

    return (
      <div>
        <div
          className="add-task form-task"
          onClick={() => this.displayForms(true)}
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
          deal={deal}
          listId={listId}
          onClose={() => this.displayForms(false)}
        />
      </div>
    )
  }
}

export default connect(null, {
  createFormTask,
  setSelectedTask,
  setUploadFiles,
  notify
})(CreateForm)

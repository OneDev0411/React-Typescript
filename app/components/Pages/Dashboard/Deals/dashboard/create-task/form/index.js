import React from 'react'
import Forms from './forms-list'

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
  displayForm(status) {
    this.setState({ showFormsModal: status })
  }

  render() {
    const {
      showFormsModal
    } = this.state
    const {
      deal,
      listId
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
        <Forms
          show={showFormsModal}
          deal={deal}
          listId={listId}
          onNew
          onClose={() => this.displayForm(false)}
        />
      </div>
    )
  }
}

export default CreateForm

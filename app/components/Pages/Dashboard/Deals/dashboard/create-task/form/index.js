import React from 'react'
import Forms from './forms-list'

class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFormsModal: false
    }
  }

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
              alt=""
            />
          </div>

          <div className="title">Add checklist item</div>
        </div>

        <Forms
          allowCustomTask
          deal={deal}
          listId={listId}
          show={showFormsModal}
          onClose={() => this.displayForms(false)}
        />
      </div>
    )
  }
}

export default CreateForm

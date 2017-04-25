import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false
    }
  }

  onEditClick() {
    this.setState({
      editMode: true
    })
  }

  cancelEditMode() {
    this.setState({
      editMode: false
    })
  }

  render() {
    const { text, showAdd, showEdit } = this.props
    const { editMode } = this.state

    if (editMode) {
      return (
        <div className="contact-editable">
          <input
            type="text"
            value={text}
          />

          <div className="control show">
            <i className="fa fa-times" onClick={() => this.cancelEditMode()}></i>
          </div>
        </div>
      )
    }

    return (
      <div className="contact-editable">
        { text }

        <div className="control">

          {
            showAdd &&
            <i
              className="fa fa-pencil"
              onClick={() => this.onEditClick()}
            >
            </i>
          }

          { showEdit && <i className="fa fa-plus-circle"></i> }
        </div>
      </div>
    )
  }
}

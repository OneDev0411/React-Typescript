import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      text: props.text
    }
  }

  onClickEdit() {
    this.setState({ editMode: true }, () => {
      // select all texts inside input
      this.text_input.select()
    })
  }

  onClickAdd() {
    const { onAdd, type } = this.props

    if (onAdd)
      onAdd(type)
  }

  onCloseEdit() {
    const { onChange, type, id } = this.props
    const { text } = this.state

    if (onChange && text !== this.props.text)
      onChange(type, id, text)

    this.setState({ editMode: false })
  }

  render() {
    const { showAdd, showEdit } = this.props
    const { text, editMode } = this.state

    if (editMode) {
      return (
        <div className="contact-editable">
          <input
            type="text"
            value={text}
            ref={ref => this.text_input = ref }
            onChange={e => this.setState({ text: e.target.value })}
            onBlur={() => this.onCloseEdit()}
            onKeyPress={e => { if (e.key === 'Enter') this.onCloseEdit()}}
          />
        </div>
      )
    }

    return (
      <div className="contact-editable">
        <span
          onDoubleClick={() => this.onClickEdit()}
        >
          { text }
        </span>

        <div className="control">

          {
            showEdit &&
            <i
              className="fa fa-pencil"
              onClick={() => this.onClickEdit()}
            >
            </i>
          }

          {
            showAdd &&
            <i
              className="fa fa-plus-circle"
              onClick={() => this.onClickAdd()}
            >
            </i>
          }
        </div>
      </div>
    )
  }
}

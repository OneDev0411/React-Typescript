import React from 'react'
import TextInput from './textinput'
import TextArea from './textarea'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      text: props.text
    }

    this.input = props.multiline ? TextArea : TextInput
  }

  onClickEdit() {
    this.setState({ editMode: true }, () => {
      // select all texts inside input
      this.text_input.select()
    })
  }

  onClickAdd() {
    const { onAdd, type } = this.props

    if (onAdd) {
      onAdd(type)
    }
  }

  onCloseEdit() {
    const { onChange, type, id } = this.props
    const { text } = this.state

    if (onChange && text.length > 0 && text !== this.props.text) {
      onChange(type, id, text)
    }

    this.setState({ editMode: false })
  }

  nl2br(input) {
    return input.split('\n').map((text, key) => (
      <div key={`editable_item___line_${key}`}>
        { text }
      </div>
    ))
  }

  render() {
    const { multiline, placeholder, showAdd, showEdit } = this.props
    const { text, editMode } = this.state
    const TextInput = this.input

    if (editMode) {
      return (
        <div className="contact-editable">
          <TextInput
            value={text}
            placeholder={placeholder}
            lines={text.split('\n').length || 1}
            onChange={e => this.setState({ text: e.target.value })}
            onBlur={() => this.onCloseEdit()}
            onClose={() => this.onCloseEdit()}
            inputRef={el => this.text_input = el}
          />
        </div>
      )
    }

    return (
      <div
        className="contact-editable"
      >
        <div
          onClick={() => this.onClickEdit()}
          className="text"
        >
          { multiline ? this.nl2br(text) : text }
        </div>

        <div
          className={`control ${multiline ? 'multiline' : ''}`}
        >

          {
            showEdit &&
            <i
              className="fa fa-pencil"
              onClick={() => this.onClickEdit()}
            />
          }

          {
            showAdd &&
            <i
              className="fa fa-plus-circle"
              onClick={() => this.onClickAdd()}
            />
          }
        </div>
      </div>
    )
  }
}

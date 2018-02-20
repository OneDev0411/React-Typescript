import React from 'react'
import TextInput from './textinput'
import TextArea from './textarea'
import cn from 'classnames'

class Editable extends React.Component {
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
    const { onAdd, type, attributeName } = this.props

    if (onAdd) {
      onAdd({ attributeName, attributeType: type })
    }
  }

  onCloseEdit() {
    const { onChange, type, id } = this.props
    const { text } = this.state

    if (typeof onChange === 'function' && text !== this.props.text) {
      if (text.length === 0) {
        onChange(type, id, '')
        this.setState({ text: '-' })
      } else {
        onChange(type, id, text)
      }
    }

    this.setState({ editMode: false })
  }

  nl2br(input) {
    return input
      .split('\n')
      .map((text, key) => <div key={`editable_item___line_${key}`}>{text}</div>)
  }

  render() {
    const {
      multiline,
      placeholder,
      showAdd,
      showEdit,
      validate,
      error,
      index
    } = this.props
    const { text, editMode } = this.state
    const TextInput = this.input

    if (editMode) {
      return (
        <div className={cn('contact-editable is-active', { error })}>
          <TextInput
            value={text || '-'}
            placeholder={placeholder}
            lines={text.split('\n').length || 1}
            onChange={e => {
              this.setState({ text: e.target.value })

              if (e.target.value !== '' && e.target.value !== '-') {
                validate(index, e.target.value)
              }
            }}
            onBlur={() => this.onCloseEdit()}
            onClose={() => this.onCloseEdit()}
            inputRef={el => (this.text_input = el)}
          />
        </div>
      )
    }

    return (
      <div className={cn('contact-editable', { error })}>
        <div onClick={() => this.onClickEdit()} className="text">
          {multiline ? this.nl2br(text) : text || '-'}
        </div>

        <div className={`control ${multiline ? 'multiline' : ''}`}>
          {showEdit && (
            <i className="fa fa-pencil" onClick={() => this.onClickEdit()} />
          )}

          {showAdd && (
            <i
              className="fa fa-plus-circle"
              onClick={() => this.onClickAdd()}
            />
          )}
        </div>
      </div>
    )
  }
}

Editable.defaultProps = {
  validate: () => {},
  error: false
}

export default Editable

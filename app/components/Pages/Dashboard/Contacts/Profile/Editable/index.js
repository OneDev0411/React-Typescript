import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

const propTypes = {
  handleParse: PropTypes.func,
  handleFormat: PropTypes.func
}

const defaultProps = {
  handleParse: t => t,
  handleFormat: t => t
}

class EditableInput extends React.Component {
  constructor(props) {
    super(props)

    const { field, handleFormat } = props

    const value = field[field.type]
    const text = handleFormat(value) || ''

    this.state = {
      text,
      error: false,
      isActive: false
    }

    this.onChange = this.onChange.bind(this)
    this.handelOnDelete = this.handelOnDelete.bind(this)
  }

  async onChange(event) {
    const { validator } = this.props
    const text = event.target.value

    if (typeof validator === 'function') {
      if (text) {
        const error = await validator(text)

        this.setState({ text, error: !error })
      } else {
        this.setState({ text, error: true })
      }
    }

    this.setState({ text })
  }

  onFocus = event => {
    event.target.select()

    this.setState({ isActive: true })
  }

  onBlur = () => {
    const { error, text } = this.state
    const { field, handleFormat } = this.props
    const fieldValue = field[field.type]

    if (error || !text) {
      return this.setState(
        {
          error: false,
          isActive: false,
          text: fieldValue || text
        },
        () => this.$input.blur()
      )
    }

    if (handleFormat(fieldValue) !== text) {
      return this.onSubmit()
    }

    this.setState(
      {
        error: false,
        isActive: false
      },
      () => this.$input.blur()
    )
  }

  onSubmit = () => {
    const { text, error } = this.state
    const { onChange, field, handleParse, handleFormat } = this.props
    const { type } = field
    const fieldPreviousValue = field[type]

    if (error || !text) {
      return false
    }

    if (
      typeof onChange === 'function' &&
      handleFormat(fieldPreviousValue) !== text
    ) {
      onChange([{ ...field, [type]: handleParse(text) }])
    }

    this.setState({ isActive: false })
  }

  onClickEdit = () => {
    this.$input.focus()
  }

  handelOnDelete() {
    const { field, onDelete } = this.props

    this.setState(
      {
        text: ''
      },
      () => {
        onDelete(field)
      }
    )
  }

  handleOnKeyUp = event => {
    const { field, handleFormat } = this.props

    if (event.keyCode === 27) {
      this.setState(
        {
          text: handleFormat(field[field.type]) || '',
          error: false,
          isActive: false
        },
        () => {
          this.$input.blur()
        }
      )
    }

    if (event.keyCode === 13) {
      this.onSubmit()
    }
  }

  render() {
    const {
      field,
      onAdd,
      showAdd,
      disabled,
      placeholder,
      validationText
    } = this.props
    const { text, error, isActive } = this.state

    return (
      <div
        className={cn('c-editable-field', {
          error,
          'is-active': isActive,
          disabled
        })}
      >
        <input
          value={text}
          disabled={disabled}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onChange={this.onChange}
          onKeyUp={this.handleOnKeyUp}
          placeholder={placeholder}
          ref={el => (this.$input = el)}
          className="c-editable-field__input"
        />

        {error && (
          <span
            data-balloon-visible
            data-balloon-pos="up"
            data-balloon-length="large"
            data-balloon={validationText}
            className="c-field-balloon c-field-balloon--error"
          />
        )}

        <div className={cn('c-editable-field__controlers')}>
          <span
            data-balloon="Edit"
            data-balloon-pos="up"
            className="c-editable-field__controlers__item"
          >
            <i className="fa fa-pencil" onClick={this.onClickEdit} />
          </span>

          {showAdd && (
            <span
              data-balloon-pos="up"
              data-balloon={`Add new ${field.type}`}
              className="c-editable-field__controlers__item"
            >
              <i onClick={onAdd} className="fa fa-plus-circle" />
            </span>
          )}

          {field.id && (
            <span
              data-balloon-pos="up"
              data-balloon="Delete"
              className="c-editable-field__controlers__item"
            >
              <i onClick={this.handelOnDelete} className="fa fa-trash" />
            </span>
          )}
        </div>
      </div>
    )
  }
}

EditableInput.propTypes = propTypes
EditableInput.defaultProps = defaultProps

export default EditableInput

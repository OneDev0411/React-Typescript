import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { uppercaseFirstLetter } from '../../../../../../utils/helpers'

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

    const value = field[field.attribute_def.data_type]
    const text = handleFormat(value) || ''

    this.state = {
      text,
      error: false,
      isActive: false
    }
  }

  onChange = event => {
    const { validator } = this.props
    let text = event.target.value

    if (typeof text === 'string' && text.trim().length === 0) {
      return this.setState({ text: '', error: false })
    }

    if (typeof validator === 'function') {
      return this.setState({ text }, async () => {
        const error = await validator(text)

        this.setState({
          error: !error
        })
      })
    }

    return this.setState({ text, error: false })
  }

  onFocus = event => {
    event.target.select()

    this.setState({ isActive: true })
  }

  onBlur = () => {
    const { error, text } = this.state
    const { field, handleFormat } = this.props
    const previousValue = handleFormat(field[field.attribute_def.data_type])

    if (error || !text) {
      return this.setState(
        {
          error: false,
          isActive: false,
          text: previousValue || ''
        },
        () => this.$input.blur()
      )
    }

    if (previousValue !== text) {
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
    if (this.state.error) {
      return false
    }

    const { onChange, field, handleParse, handleFormat } = this.props
    const { data_type } = field.attribute_def
    const fieldPreviousValue = field[data_type]
    const text = this.state.text.replace(/^\s+|\s+$|\s+(?=\s)/g, '')

    if (
      typeof onChange === 'function' &&
      handleFormat(fieldPreviousValue) !== text
    ) {
      const attribute = { ...field, [data_type]: handleParse(text) }

      if (field.attribute_def.has_label && !field.label) {
        attribute.label = field.attribute_def.labels[0]
      }

      onChange(attribute)
    }

    this.setState({ isActive: false, text })
  }

  onClickEdit = () => {
    this.$input.focus()
  }

  handelOnDelete = () => {
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
          error: false,
          isActive: false,
          text: handleFormat(field[field.attribute_def.data_type]) || ''
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
            data-balloon-length="medium"
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
              data-balloon={`Add new ${field.type
                .split('_')
                .map(uppercaseFirstLetter)
                .join(' ')}`}
              className="c-editable-field__controlers__item"
            >
              <i
                onClick={() => onAdd(field.attribute_def)}
                className="fa fa-plus-circle"
              />
            </span>
          )}

          {field.id &&
            text && (
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

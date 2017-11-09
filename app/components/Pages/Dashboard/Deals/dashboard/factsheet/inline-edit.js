import React from 'react'
import { connect } from 'react-redux'
import DatePicker from '../../components/date-picker'
import cn from 'classnames'
import Deal from '../../../../../../models/Deal'

export default class Editable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false
    }
  }

  deleteField(e, field) {
    e.stopPropagation()
    this.props.onChange(field, null)
  }

  onFinishEditing(value = null) {
    const { field, onChange } = this.props
    let fieldValue = value

    if (value === null && this.input) {
      fieldValue = this.input.value
    }

    this.setState({
      editMode: false
    })

    if (fieldValue !== null && fieldValue !== this.getValue()) {
      onChange(field, fieldValue)
    }
  }

  onKeyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.onFinishEditing()
    }
  }

  editField() {
    const { editable } = this.props

    this.setState({
      editMode: true
    }, () => this.input && this.input.focus())
  }

  getCtas() {
    const { editMode } = this.state
    const { editable, context, field, saving } = this.props
    const isDateType = field.fieldType === 'date'

    const showCTA = saving !== field.key && !editMode

    return (
      <span>
        <i
          className={cn('fa fa-times-circle ico-remove', {
            hide: !showCTA || !context.value || context.value.length === 0
          })}
          data-tip={editable ? null : "This field needs office approval after removing" }
          onClick={(e) => this.deleteField(e, field)}
        />

        <i
          className={cn('fa fa-pencil', { hide: !showCTA })}
          data-tip={editable ? null : "This field needs office approval after changing" }
        />
      </span>
    )
  }

  getValue() {
    const { context } = this.props
    const value = context.rawValue || context.value || ''
    return value.toString()
  }

  cancelEditing() {
    this.setState({
      editMode: false
    })
  }

  render() {
    const { isBackOffice, field, context, approved, editable, disabled } = this.props
    const { editMode } = this.state
    const isDateType = field.fieldType === 'date'
    const isStringType = !isDateType

    if (disabled) {
      return <span>{context.value}</span>
    }

    return (
      <div
        style={{ display: 'inline-block', minWidth: '100%' }}
        onClick={() => this.editField()}
      >

        <DatePicker
          show={editMode && field.fieldType === 'date'}
          saveText={editable ? 'Update' : 'Notify Admin'}
          initialDate={this.getValue()}
          onClose={() => this.cancelEditing()}
          onSelectDate={date => this.onFinishEditing(date)}
        />

        {
          editMode && isStringType ?
          '' :
          <span
            data-tip={approved ? null : 'Approval is pending on this date'}
          >
            {context.value}
          </span>
        }

        {
          editMode && isStringType &&
          <div className="inline">
            <input
              className="input-edit"
              onBlur={() => this.onFinishEditing()}
              defaultValue={this.getValue()}
              onKeyPress={(e) => this.onKeyPress(e)}
              ref={(input) => this.input = input}
              maxLength={15}
            />
            <i
              className="fa fa-check-circle"
              onClick={() => this.onFinishEditing()}
            />
          </div>
        }

        <span className="cta">
          {this.getCtas()}
        </span>
      </div>
    )
  }
}

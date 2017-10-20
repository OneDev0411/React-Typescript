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

  onFinishEditing(value = null) {
    const { field, onChange } = this.props
    const fieldValue = value || this.input.value

    this.setState({
      editMode: false
    })

    if (fieldValue !== this.getValue()) {
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

    if (!editable) {
      return false
    }

    this.setState({
      editMode: true
    }, () => {
      this.input && this.input.focus()
    })
  }

  getEditCta() {
    const { editMode } = this.state
    const { editable, field, saving } = this.props
    const isDateType = field.fieldType === 'date'

    if (saving === field.key || (editMode && !isDateType)) {
      return false
    }

    if (editable && saving !== field.key) {
      return (
        <i className="fa fa-pencil" />
      )
    }

    return (
      <i
        className="fa fa-lock"
        data-tip="Please contact your admin to update this date."
      />
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
      return <span>{ context.value }</span>
    }

    return (
      <div
        className="inline"
        onClick={() => this.editField()}
      >

        <DatePicker
          show={editMode && field.fieldType === 'date'}
          initialDate={this.getValue()}
          onClose={() => this.cancelEditing()}
          onSelectDate={date => this.onFinishEditing(date)}
        />

        {
          editMode && isStringType ? '' : context.value
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
              className="fa fa-floppy-o"
              onClick={() => this.onFinishEditing()}
            />
          </div>
        }

        <span className="cta">
          {this.getEditCta()}
        </span>
      </div>
    )
  }
}

import React from 'react'
import DatePicker from '../../components/date-picker'
import cn from 'classnames'
import ToolTip from '../../components/tooltip'

export default class Editable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      error: false
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

    if (fieldValue && fieldValue !== this.getValue() && field.validate(fieldValue)) {
      onChange(field, fieldValue)
    }
  }

  onKeyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.onFinishEditing()
    }
  }

  editField() {
    this.setState({
      editMode: true
    }, () => this.input && this.input.focus())
  }

  getCtas() {
    const { editMode } = this.state
    const { editable, context, field, saving } = this.props
    const showCTA = saving !== field.name && !editMode

    return (
      <span>
        <ToolTip caption={editable ? null : 'This field needs office approval after removing'}>
          <i
            className={cn('fa fa-times-circle ico-remove', {
              hide: !showCTA || !context.value || context.value.length === 0
            })}
            onClick={(e) => this.deleteField(e, field)}
          />
        </ToolTip>

        <ToolTip caption={editable ? null : 'This field needs office approval after changing'}>
          <i className={cn('fa fa-pencil', { hide: !showCTA })} />
        </ToolTip>
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
    const { field, context, approved, editable, disabled, saving } = this.props
    const { editMode, error } = this.state
    const isDateType = field.data_type === 'Date'
    const isStringType = !isDateType

    if (disabled) {
      return <span className="disabeld-field">{context.value}</span>
    }

    return (
      <div className={cn('field', { editable: true, approved, disabled, error })}>
        <DatePicker
          show={editMode && isDateType}
          saveText={editable ? 'Update' : 'Notify Office'}
          initialDate={this.getValue()}
          onClose={() => this.cancelEditing()}
          onSelectDate={date => this.onFinishEditing(date)}
        />

        <div
          style={{ display: 'inline-block', minWidth: '80%' }}
          onClick={() => this.editField()}
        >
          {
            (!editMode || (editMode && isDateType)) &&
            <ToolTip caption={approved ? null : 'Pending Office Approval'}>
              <span style={{ opacity: saving ? 0.8 : 1 }}>
                {context.value}
              </span>
            </ToolTip>
          }

          {
            editMode && isStringType &&
            <div className="inline">
              <input
                className="input-edit"
                onBlur={() => this.onFinishEditing()}
                defaultValue={this.getValue()}
                onKeyPress={(e) => this.onKeyPress(e)}
                onChange={e => {
                  const error = this.input && !field.validate(e.target.value)
                  this.setState({ error })
                }}
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
        {
          saving && saving === field.name &&
          <i className="fa fa-spin fa-spinner" style={{ display: 'inline-block' }}/>
        }
      </div>
    )
  }
}

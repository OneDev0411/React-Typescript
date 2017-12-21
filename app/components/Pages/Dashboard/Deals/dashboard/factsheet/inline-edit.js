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

    if (fieldValue !== null && fieldValue !== this.getValue()) {
      if (field.validate && field.validate(fieldValue)) {
        onChange(field, fieldValue)
      }
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

    const showCTA = saving !== field.key && !editMode

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
    const isDateType = field.fieldType === 'date'
    const isStringType = !isDateType

    if (disabled) {
      return <span className="disabeld-field">{context.value}</span>
    }


    return (
      <div className={cn('field'
        , { editable: true, approved, disabled }
        , { error })}
      >

        <div
          style={{ display: 'inline-block', minWidth: '100%' }}
          onClick={() => this.editField()}
        >

          <DatePicker
            show={editMode && field.fieldType === 'date'}
            saveText={editable ? 'Update' : 'Notify Office'}
            initialDate={this.getValue()}
            onClose={() => this.cancelEditing()}
            onSelectDate={date => this.onFinishEditing(date)}
          />

          {
            editMode && isStringType ?
              '' :
              <ToolTip caption={approved ? null : 'Pending Office Approval'}>
                <span>{context.value}</span>
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
                  const error = this.input
                    && field.validate
                    && !field.validate(e.target.value)

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
          saving && saving === field.key &&
          <i className="fa fa-spin fa-spinner" />
        }
      </div>
    )
  }
}

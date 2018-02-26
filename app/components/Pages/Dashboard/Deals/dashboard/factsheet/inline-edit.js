import React from 'react'
import cn from 'classnames'
import ClickOutside from 'react-click-outside'
import DatePicker from '../../components/date-picker'
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
      editMode: false,
      error: false
    })

    if (
      fieldValue &&
      fieldValue !== this.getValue() &&
      field.validate(field, fieldValue)
    ) {
      onChange(field, fieldValue)
    }
  }

  cancelEdit(e) {
    e && e.stopPropagation()
    this.input.value = this.getValue()
    this.setState({
      editMode: false,
      error: false
    })
  }
  onKeyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.onFinishEditing()
    }
  }

  editField() {
    this.setState(
      {
        editMode: true
      },
      () => this.input && this.input.focus()
    )
  }

  getCtas() {
    const { editMode } = this.state
    const { needsApproval, context, field, saving } = this.props
    const showCTA = saving !== field.name && !editMode

    return [
      <ToolTip
        key="EDITABLE_INPUT_CTA_BUTTON__EDIT"
        caption={
          needsApproval
            ? 'This field needs office approval after changing'
            : null
        }
      >
        <span className={cn('cta__button', { hide: !showCTA })}>EDIT</span>
      </ToolTip>,
      <ToolTip
        key="EDITABLE_INPUT_CTA_BUTTON__DELETE"
        caption={
          needsApproval
            ? 'This field needs office approval after removing'
            : null
        }
      >
        <button
          className={cn(
            'c-button--shadow cta__button ico-remove fa fa-times-circle',
            {
              hide: !showCTA || !context.value || context.value.length === 0
            }
          )}
          onClick={e => this.deleteField(e, field)}
        />
      </ToolTip>
    ]
  }

  getValue() {
    const { context } = this.props
    const value = context.rawValue || context.value || ''

    return value.toString()
  }

  removeEditMode() {
    this.setState({
      editMode: false
    })
  }

  render() {
    const {
      field,
      context,
      approved,
      needsApproval,
      disabled,
      saving,
      isBackOffice
    } = this.props
    const { editMode, error } = this.state
    const isDateType = field.data_type === 'Date'
    const isStringType = !isDateType

    if (disabled) {
      return (
        <div className={cn('fact-row', { disabled })}>
          <div className="name">{field.label}</div>
          <span className="disabeld-field">{context.value}</span>
        </div>
      )
    }

    return (
      <div className={cn('fact-row', { disabled })}>
        <div className="name" onClick={() => this.editField()}>
          {field.label}
        </div>
        <div className={cn('field editable', { approved, disabled, error })}>
          <DatePicker
            show={editMode && isDateType}
            saveText={needsApproval ? 'Notify Office' : 'Update'}
            initialDate={this.getValue()}
            onClose={() => this.removeEditMode()}
            onSelectDate={date => this.onFinishEditing(date)}
          />

          <div
            style={{ display: 'inline-block', minWidth: '80%' }}
            onClick={() => this.editField()}
          >
            {(!editMode || (editMode && isDateType)) && (
              <ToolTip
                caption={
                  approved || isBackOffice ? null : 'Pending Office Approval'
                }
              >
                <span style={{ opacity: saving ? 0.8 : 1 }}>
                  {context.value}
                </span>
              </ToolTip>
            )}

            {editMode &&
              isStringType && (
                <ClickOutside
                  onClickOutside={() => this.onFinishEditing()}
                  className="inline"
                >
                  <input
                    className="input-edit"
                    defaultValue={this.getValue()}
                    onKeyPress={e => this.onKeyPress(e)}
                    onChange={e => {
                      const error =
                        this.input && !field.validate(field, e.target.value)

                      this.setState({ error })
                    }}
                    ref={input => (this.input = input)}
                    maxLength={15}
                  />
                  <button
                    className="c-button--shadow"
                    onClick={e => {
                      e.stopPropagation()
                      this.onFinishEditing()
                    }}
                  >
                    SAVE
                  </button>
                  <button
                    className="c-button--shadow ico-remove fa fa-times-circle"
                    onClick={e => this.cancelEdit(e)}
                  />
                </ClickOutside>
              )}

            <span className="cta">{this.getCtas()}</span>
          </div>
          {saving &&
            saving === field.name && (
              <i
                className="fa fa-spin fa-spinner"
                style={{ display: 'inline-block', marginLeft: '0.5rem' }}
              />
            )}
        </div>
      </div>
    )
  }
}

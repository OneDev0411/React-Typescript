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
    const { error } = this.state

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
    const {
      needsApproval, context, field, saving
    } = this.props
    const showCTA = saving !== field.name && !editMode

    return [
      <ToolTip
        key="EDITABLE_INPUT_CTA_BUTTON__EDIT"
        caption={
          needsApproval ? null : 'This field needs office approval after changing'
        }
      >
        <span className={cn('cta__button', { hide: !showCTA })}>EDIT</span>
      </ToolTip>,
      <ToolTip
        key="EDITABLE_INPUT_CTA_BUTTON__DELETE"
        caption={
          needsApproval ? null : 'This field needs office approval after removing'
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

  cancelEditing() {
    this.setState({
      editMode: false
    })
  }

  render() {
    const {
      field, context, approved, needsApproval, disabled, saving
    } = this.props
    const { editMode, error } = this.state
    const isDateType = field.data_type === 'Date'
    const isStringType = !isDateType

    if (disabled) {
      return <span className="disabeld-field">{context.value}</span>
    }

    return (
      <div className={cn('field editable', { approved, disabled, error })}>
        <DatePicker
          show={editMode && isDateType}
          saveText={needsApproval ? 'Update' : 'Notify Office'}
          initialDate={this.getValue()}
          onClose={() => this.cancelEditing()}
          onSelectDate={date => this.onFinishEditing(date)}
        />

        <div
          style={{ display: 'inline-block', minWidth: '80%' }}
          onClick={() => this.editField()}
        >
          {(!editMode || (editMode && isDateType)) && (
            <ToolTip caption={approved ? null : 'Pending Office Approval'}>
              <span style={{ opacity: saving ? 0.8 : 1 }}>{context.value}</span>
            </ToolTip>
          )}

          {editMode &&
            isStringType && (
              <div className="inline">
                <input
                  className="input-edit"
                  onBlur={() => this.onFinishEditing()}
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
                  className="c-button--shadow fa fa-check-circle"
                  onClick={() => this.onFinishEditing()}
                />
              </div>
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
    )
  }
}

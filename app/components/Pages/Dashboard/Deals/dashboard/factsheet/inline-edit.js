import React from 'react'
import cn from 'classnames'
import ClickOutside from 'react-click-outside'
import _ from 'underscore'
import DatePicker from '../../components/date-picker'
import ToolTip from '../../components/tooltip'
import Input from '../../../../../../views/components/Input'
import ContextDiscrepencyOverview from '../context-discrepency/overview'

export default class Editable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null,
      editMode: false
    }
  }

  deleteField(e, field) {
    e.stopPropagation()
    this.props.onChange(field, null)
  }

  onFinishEditing(value = null) {
    const { field, onChange } = this.props

    const fieldValue = value || this.state.value

    this.setState({
      editMode: false
    })

    if (
      !_.isUndefined(fieldValue) &&
      fieldValue !== this.getContextValue() &&
      field.validate(field, fieldValue)
    ) {
      onChange(field, fieldValue)
    } else {
      this.setState({
        value: this.getContextValue()
      })
    }
  }

  cancelEdit(e) {
    e && e.stopPropagation()
    this.setState({
      value: this.getValue(),
      editMode: false
    })
  }

  onKeyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.onFinishEditing()
    }
  }

  editField() {
    this.setState({
      editMode: true
    })
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
    const { value } = this.state

    return value !== null ? value : this.getContextValue()
  }

  getContextValue() {
    const { context } = this.props

    if (!_.isUndefined(context.rawValue) && context.rawValue !== null) {
      return context.rawValue.toString()
    } else if (!_.isUndefined(context.value) && context.value !== null) {
      return context.value.toString()
    }

    return ''
  }

  getFormattedValue() {
    return this.props.field.getFormattedValue(this.getValue())
  }

  removeEditMode() {
    this.setState({
      editMode: false
    })
  }

  render() {
    const {
      field,
      discrepency,
      approved,
      needsApproval,
      disabled,
      saving,
      isBackOffice
    } = this.props
    const { editMode } = this.state
    const isDateType = field.data_type === 'Date'
    const isStringType = !isDateType

    if (disabled) {
      return (
        <div className={cn('fact-row', { disabled })}>
          <div className="name">{field.label}</div>
          <span className="disabeld-field">
            {/* {discrepency && ( */}
            {/* <ContextDiscrepencyOverview */}
            {/* placement="top" */}
            {/* context={discrepency} */}
            {/* /> */}
            {/* )} */}
            {this.getFormattedValue()}
          </span>
        </div>
      )
    }

    return (
      <div className={cn('fact-row', { disabled })}>
        <div className="name" onClick={() => this.editField()}>
          {field.label}
        </div>

        <div className={cn('field editable', { approved, disabled })}>
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
                  {discrepency && (
                    <ContextDiscrepencyOverview
                      context={discrepency}
                      placement="top"
                      onClick={e => e.stopPropagation()}
                    />
                  )}

                  {this.getFormattedValue()}
                </span>
              </ToolTip>
            )}

            {editMode &&
              isStringType && (
                <ClickOutside
                  onClickOutside={() => this.onFinishEditing()}
                  className="inline"
                >
                  <Input
                    data-type={field.format || field.data_type}
                    {...field.properties}
                    className="input-edit"
                    maxLength={15}
                    value={this.getValue()}
                    onKeyPress={e => this.onKeyPress(e)}
                    ErrorMessageHandler={({ message }) => (
                      <span
                        style={{
                          position: 'absolute',
                          right: '5px'
                        }}
                        data-balloon={message}
                        data-balloon-pos="left"
                      >
                        <i
                          style={{
                            verticalAlign: 'middle',
                            fontSize: '14px',
                            color: '#ec4b35'
                          }}
                          className="fa fa-warning"
                        />
                      </span>
                    )}
                    onChange={(e, data = {}) =>
                      this.setState({
                        value: !_.isUndefined(data.value)
                          ? data.value
                          : e.target.value
                      })
                    }
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

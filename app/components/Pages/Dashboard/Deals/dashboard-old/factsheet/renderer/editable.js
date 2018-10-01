import React from 'react'
import cn from 'classnames'
import ClickOutside from 'react-click-outside'
import _ from 'underscore'
import DatePicker from '../../../components/date-picker'
import ToolTip from '../../../../../../../views/components/tooltip/index'
import Input from '../../../../../../../views/components/Input'
import EditableCta from './editable-cta'
import ContextDiscrepency from '../../context-discrepency'
import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import { primary } from 'views/utils/colors'
import { grey } from '../../../../../../../views/utils/colors'

const SaveButton = ActionButton.extend`
  padding: 0 0.5rem;
`

const DeleteButton = IconButton.extend`
  padding: 0;
  color: ${grey.A600};
  &:hover {
    color: ${primary};
  }
`

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

  onChangeDateContext(date) {
    this.onFinishEditing(date)
    this.setState({
      value: null
    })
  }

  onFinishEditing(value = null) {
    const { field } = this.props

    const fieldValue = value || this.state.value

    this.setState({
      editMode: false
    })

    if (
      !_.isUndefined(fieldValue) &&
      fieldValue !== this.getContextValue() &&
      field.validate(field, fieldValue)
    ) {
      this.props.onChange(field, fieldValue)
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
      editMode: true,
      value: this.getContextValue()
    })
  }

  getValue() {
    const { value } = this.state

    return value !== null ? value : this.getContextValue()
  }

  getContextValue() {
    const { contextData: context } = this.props

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

  showDiscrepencyPopover(e) {
    e.stopPropagation()
  }

  render() {
    const {
      sectionId,
      deal,
      field,
      contextData,
      approved,
      needsApproval,
      saving,
      isBackOffice
    } = this.props
    const { editMode } = this.state
    const isDateType = field.data_type === 'Date'
    const isStringType = !isDateType

    return (
      <div className="fact-row">
        <DatePicker
          show={editMode && isDateType}
          saveText={needsApproval ? 'Notify Office' : 'Update'}
          initialDate={this.getValue()}
          onClose={() => this.removeEditMode()}
          onSelectDate={date => this.onChangeDateContext(date)}
        />

        <div
          className="name"
          data-name={field.name}
          onClick={() => this.editField()}
        >
          {field.label}
        </div>

        <div className={cn('field editable', { approved })}>
          <ContextDiscrepency
            disabled={editMode || !isBackOffice}
            deal={deal}
            contextName={field.name}
            placement={sectionId === 'critical-dates' ? 'bottom' : 'top'}
          />

          {(!editMode || (editMode && isDateType)) && (
            <ToolTip
              caption={
                approved || isBackOffice ? null : 'Pending Office Approval'
              }
            >
              <span
                onClick={() => this.editField()}
                style={{ textAlign: 'left', opacity: saving ? 0.8 : 1 }}
              >
                {this.getFormattedValue()}
              </span>
            </ToolTip>
          )}

          {editMode &&
            isStringType && (
              <ClickOutside
                onClickOutside={() => this.onFinishEditing()}
                style={{ display: 'flex', alignItems: 'center' }}
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

                <SaveButton
                  size="small"
                  appearance="link"
                  onClick={e => {
                    e.stopPropagation()
                    this.onFinishEditing()
                  }}
                >
                  SAVE
                </SaveButton>

                <DeleteButton
                  size="small"
                  onClick={e => this.cancelEdit(e)}
                  // className="cta__button"
                >
                  <div className="fa fa-times-circle" />
                </DeleteButton>
              </ClickOutside>
            )}

          <EditableCta
            needsApproval={needsApproval}
            contextData={contextData}
            showCTA={saving !== field.name && !editMode}
            handleEditField={() => this.editField()}
            handleDeleteField={e => this.deleteField(e, field)}
          />

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

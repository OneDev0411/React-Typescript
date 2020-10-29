import React from 'react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import {
  formatValue,
  getTitle,
  getValue,
  parseValue,
  getPlaceholder,
  validation
} from './helpers'

import { EditMode } from './EditMode'
import { ViewMode } from './ViewMode'
import { TriggerField } from './TriggerField'

import { TRIGGABLE_ATTRIBUTE } from './constant'

function getCurrentTimestamp() {
  return new Date().getTime()
}

function getStateFromAttribute(attribute) {
  const updated_at = getCurrentTimestamp()

  if (attribute) {
    return {
      is_primary: attribute.is_primary,
      label: attribute.label || '',
      updated_at: attribute.updated_at || updated_at,
      value: getValue(attribute)
    }
  }

  return {
    is_primary: false,
    label: '',
    updated_at,
    value: ''
  }
}

const getInitialState = attribute => ({
  error: '',
  disabled: false,
  isDrity: false,
  isTriggerActive: false,
  triggerSendBefore: '1',
  triggerSelectedTemplate: null,
  triggerRenderedSelectedTemplate: null,
  ...getStateFromAttribute(attribute)
})

function diffAttributeStateWithProp(attribute, state) {
  const { label, value, is_primary } = getStateFromAttribute(attribute)

  return (
    is_primary !== state.is_primary ||
    label !== state.label ||
    value !== state.value
  )
}

class MasterField extends React.Component {
  constructor(props) {
    super(props)

    const { attribute_def } = props.attribute

    this.attribute_def = attribute_def
    this.showAdd = !attribute_def.singular
    this.type = attribute_def.data_type
    this.state = getInitialState(props.attribute)
  }

  static getDerivedStateFromProps({ attribute, isActive }, state) {
    if (
      !isActive &&
      attribute.updated_at &&
      attribute.updated_at > state.updated_at
    ) {
      return getInitialState(attribute)
    }

    return null
  }

  static contextType = ConfirmationModalContext

  get attributePropsFromState() {
    const { is_primary, label } = this.state

    return {
      label,
      is_primary,
      [this.type]: this.state.value
    }
  }

  get title() {
    return getTitle(this.attribute_def, this.state.label)
  }

  get placeholder() {
    return getPlaceholder(this.attribute_def)
  }

  get isDrity() {
    return (
      this.state.isDrity &&
      diffAttributeStateWithProp(this.props.attribute, this.state)
    )
  }

  get isTriggable() {
    return TRIGGABLE_ATTRIBUTE.includes(this.attribute_def.name)
  }

  toggleMode = () => this.props.handleToggleMode(this.props.attribute)

  setInitialState = () => {
    this.toggleMode()
    this.setState(getInitialState(this.props.attribute))
  }

  onChangeLabel = label =>
    this.setState({ label, isDrity: true, updated_at: getCurrentTimestamp() })

  onChangeValue = value =>
    this.setState({ value, isDrity: true, updated_at: getCurrentTimestamp() })

  toggleTriggerActive = () =>
    this.setState(prevState => ({
      isDrity: true,
      isTriggerActive: !prevState.isTriggerActive
    }))

  onChangeSendBefore = value =>
    this.setState({ isDrity: true, triggerSendBefore: value })

  onChangeTemplate = template => {
    this.setState({ isDrity: true, triggerSelectedTemplate: template })
  }

  onChangePrimary = () =>
    this.setState(state => ({
      is_primary: !state.is_primary,
      isDrity: true,
      updated_at: getCurrentTimestamp()
    }))

  cancel = () => {
    if (!this.state.disabled) {
      this.setInitialState()
    }
  }

  handleOutsideClick = () => {
    if (this.state.disabled) {
      return
    }

    if (this.isDrity) {
      this.context.setConfirmationModal({
        message: 'Heads up!',
        confirmLabel: 'Yes, I do',
        onConfirm: this.setInitialState,
        description: 'You have made changes, do you want to discard them?'
      })
    } else {
      this.setInitialState()
    }
  }

  save = async () => {
    // console.log('save method', this.state)
    const { attribute } = this.props
    const { id, cuid } = attribute
    const { is_primary, label, value } = this.state

    if (!this.isDrity) {
      return this.setState({ error: id ? 'Update value!' : 'Input something!' })
    }

    const error = await validation(this.attribute_def, value)

    if (error) {
      return this.setState({ error })
    }

    try {
      this.setState({ disabled: true, error: '' })

      const data = {
        cuid,
        id,
        label: label === '' ? null : label,
        [this.type]: parseValue(value, this.attribute_def)
      }

      if (is_primary !== this.props.attribute.is_primary) {
        data.is_primary = is_primary
      }

      this.props.handleSave(attribute, data)

      this.setState({ disabled: false, isDrity: false }, this.toggleMode)
    } catch (error) {
      console.error(error)
      this.setState({ disabled: false, error: error.message })
    }
  }

  delete = async () => {
    try {
      await this.props.handleDelete(this.props.attribute)
      this.setState({ disabled: false })
    } catch (error) {
      console.error(error)
    }
  }

  handleDelete = () => {
    this.setState({ disabled: true })

    const title = this.attribute_def.label
    const options = {
      confirmLabel: 'Yes, I do',
      message: `Delete ${title}`,
      onConfirm: this.delete,
      onCancel: () => this.setState({ disabled: false }),
      description: `You have made changes, are you sure about deleting "${title}" field?`
    }

    if (this.isDrity) {
      this.context.setConfirmationModal(options)
    } else if (this.props.attribute[this.attribute_def.data_type]) {
      this.context.setConfirmationModal({
        ...options,
        description: `Are you sure about deleting "${title}" field, you will lose it forever?`
      })
    } else {
      this.delete()
    }
  }

  addInstance = () => {
    this.props.handleAddNewInstance(this.props.attribute)
  }

  handleEnterKey = event => {
    if (event.keyCode === 13) {
      this.save()
    }
  }

  renderEditMode = props => (
    <EditMode
      {...props}
      attribute={{
        ...this.props.attribute,
        ...this.state,
        [this.type]: this.state.value
      }}
      handleEnterKey={this.handleEnterKey}
      onChangeLabel={this.onChangeLabel}
      onChangeValue={this.onChangeValue}
      onChangePrimary={this.onChangePrimary}
      placeholder={this.placeholder}
    >
      {this.isTriggable ? (
        <TriggerField
          isActive={this.state.isTriggerActive}
          sendBefore={this.state.triggerSendBefore}
          selectedTemplate={this.state.triggerSelectedTemplate}
          toggleActive={this.toggleTriggerActive}
          onChangeSendBefore={this.onChangeSendBefore}
          onChangeTemplate={this.onChangeTemplate}
        />
      ) : null}
    </EditMode>
  )

  renderViewMode = () => (
    <ViewMode
      is_primary={this.state.is_primary}
      name={this.attribute_def.name || ''}
      title={this.title}
      value={formatValue(this.attribute_def, this.state.value)}
    />
  )

  render() {
    if (!this.attribute_def.editable) {
      return (
        <div style={{ margin: '0 -0.5em', padding: '0.5em' }}>
          {this.renderViewMode()}
        </div>
      )
    }

    return (
      <InlineEditableField
        error={this.state.error}
        cancelOnOutsideClick
        handleAddNew={this.addInstance}
        handleCancel={this.cancel}
        handleDelete={this.handleDelete}
        handleOutsideClick={this.handleOutsideClick}
        handleSave={this.save}
        isDisabled={this.state.disabled}
        isEditing={this.props.isActive}
        isPopoverMode={this.isTriggable}
        isEditModeStatic
        label={this.state.label}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showAdd={this.showAdd}
        showDelete
        style={{ margin: '0 -0.5em' }}
        toggleMode={this.toggleMode}
        value={this.state.value}
      />
    )
  }
}

export default MasterField

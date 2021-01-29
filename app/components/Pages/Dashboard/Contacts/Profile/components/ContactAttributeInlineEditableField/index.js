import React from 'react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'
import {
  createTrigger,
  updateTrigger,
  removeTrigger
} from 'models/instant-marketing/triggers'

import { noop } from 'utils/helpers'

import {
  formatValue,
  getTitle,
  getValue,
  parseValue,
  getPlaceholder,
  validation,
  validateTriggerFields
} from './helpers'

import { EditMode } from './EditMode'
import { ViewMode } from './ViewMode'
import { TriggerEditMode } from './TriggerEditMode'
import { getTriggerSubject } from './TriggerEditMode/helpers'

import { TRIGGERABLE_ATTRIBUTES } from './constants'

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
function getStateFromTrigger(trigger, attribute) {
  const attributeName = attribute?.attribute_def?.name || ''

  if (trigger) {
    return {
      currentTrigger: trigger,
      isTriggerActive: true,
      triggerSubject:
        trigger.campaign?.subject || getTriggerSubject(attributeName),
      triggerSendBefore: trigger.wait_for || 0,
      triggerSelectedTemplate: null
    }
  }

  // we're checking if date value is already exist
  // disable the trigger unless enable it
  let isActive

  if (
    attribute &&
    TRIGGERABLE_ATTRIBUTES.includes(attribute.attribute_def?.name)
  ) {
    const attributeValue = getValue(attribute)

    if (
      typeof attributeValue === 'object' &&
      (!attributeValue.year ||
        !attributeValue.month?.value ||
        !attributeValue.day?.value)
    ) {
      isActive = true
    } else {
      isActive = false
    }
  }

  return {
    currentTrigger: null,
    isTriggerActive: isActive,
    triggerSubject: getTriggerSubject(attributeName),
    triggerSendBefore: 0,
    triggerSelectedTemplate: null
  }
}

function getInitialErrorMessage(contact) {
  if (!contact) {
    return ''
  }

  if (!contact.email) {
    return "You should provide contact's email to be able to use trigger feature."
  }

  if (!contact.user) {
    return "You should set an contact's owner to be able to use trigger feature."
  }

  return ''
}

const getInitialState = ({ contact, attribute, trigger }) => ({
  error: getInitialErrorMessage(contact),
  isDirty: false,
  isTriggerFieldDirty: false,
  isTriggerSaving: false,
  disabled: false,
  ...getStateFromTrigger(trigger, attribute),
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
    this.state = getInitialState(props)
  }

  static getDerivedStateFromProps(props, state) {
    if (
      !props.isActive &&
      props.attribute?.updated_at &&
      props.attribute?.updated_at > state.updated_at
    ) {
      return getInitialState(props)
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

  get isDirty() {
    return (
      this.state.isDirty &&
      diffAttributeStateWithProp(this.props.attribute, this.state)
    )
  }

  get isTriggerable() {
    return (
      TRIGGERABLE_ATTRIBUTES.includes(this.attribute_def.name) &&
      !this.props.attribute?.is_partner
    )
  }

  toggleMode = () => this.props.handleToggleMode(this.props.attribute)

  setInitialState = () => {
    this.toggleMode()
    this.setState(getInitialState(this.props))
  }

  onChangeLabel = label =>
    this.setState({ label, isDirty: true, updated_at: getCurrentTimestamp() })

  onChangeValue = value =>
    this.setState({ value, isDirty: true, updated_at: getCurrentTimestamp() })

  onChangeTriggerActive = value =>
    this.setState({
      isDirty: true,
      isTriggerFieldDirty: true,
      isTriggerActive: value
    })

  onChangeSubject = value =>
    this.setState({
      isDirty: true,
      isTriggerFieldDirty: true,
      triggerSubject: value
    })

  onChangeSendBefore = value =>
    this.setState({
      isDirty: true,
      isTriggerFieldDirty: true,
      triggerSendBefore: value
    })

  onChangeTemplate = template => {
    this.setState({
      isDirty: true,
      isTriggerFieldDirty: true,
      triggerSelectedTemplate: template
    })
  }

  onChangePrimary = () =>
    this.setState(state => ({
      is_primary: !state.is_primary,
      isDirty: true,
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

    if (this.isDirty) {
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

  save = async (callback = noop) => {
    const { contact, attribute, trigger: triggerFromParent } = this.props
    const {
      is_primary,
      label,
      value,
      currentTrigger,
      isTriggerFieldDirty,
      isTriggerActive,
      triggerSubject,
      triggerSendBefore,
      triggerSelectedTemplate
    } = this.state

    const trigger = triggerFromParent || currentTrigger
    const { id, cuid } = attribute
    const shouldCheckTriggerField = this.isTriggerable && isTriggerFieldDirty

    if (shouldCheckTriggerField) {
      const error = validateTriggerFields(
        {
          template: triggerSelectedTemplate,
          wait_for: triggerSendBefore,
          subject: triggerSubject,
          event_type: this.attribute_def.name
        },
        trigger
      )

      if (error) {
        return this.setState({ error })
      }
    }

    if (!this.isDirty) {
      const error = id ? 'Update value!' : 'Change something!'

      return this.setState({ error })
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

      if (shouldCheckTriggerField) {
        this.setState({ isTriggerSaving: true })

        const commonParams = [
          contact,
          triggerSelectedTemplate,
          {
            recurring: true,
            time: '08:00:00', // it's hard coded base api team comment
            subject: triggerSubject,
            wait_for: triggerSendBefore,
            event_type: this.attribute_def.name
          }
        ]

        if (trigger) {
          if (!isTriggerActive) {
            await removeTrigger(trigger.id)
          } else {
            await updateTrigger(trigger, ...commonParams)
          }
        } else if (isTriggerActive) {
          await createTrigger(...commonParams)
        }
      }

      this.props.handleSave(attribute, data)
      this.setState(
        { disabled: false, isDirty: false, isTriggerSaving: false },
        this.toggleMode
      )
      callback()
    } catch (error) {
      console.error(error)
      this.setState({ disabled: false, error: error.message })
    }
  }

  delete = async () => {
    try {
      const { currentTrigger } = this.state
      const { trigger: triggerFromParent } = this.props
      const trigger = triggerFromParent || currentTrigger

      if (trigger) {
        await removeTrigger(trigger.id)
      }

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

    if (this.isDirty) {
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

  onEnterKeyPress = event => {
    if (event.keyCode === 13) {
      this.save()
    }
  }

  renderEditMode = props => {
    const { trigger: triggerFromParent, contact, attribute } = this.props
    const {
      currentTrigger,
      isTriggerActive,
      isTriggerSaving,
      triggerSubject,
      triggerSendBefore,
      triggerSelectedTemplate
    } = this.state
    const baseEditMode = (
      <EditMode
        {...props}
        attribute={{
          ...attribute,
          ...this.state,
          [this.type]: this.state.value
        }}
        onEnterKeyPress={this.onEnterKeyPress}
        onChangeLabel={this.onChangeLabel}
        onChangeValue={this.onChangeValue}
        onChangePrimary={this.onChangePrimary}
        placeholder={this.placeholder}
      />
    )

    if (this.isTriggerable) {
      const trigger = triggerFromParent || currentTrigger

      return (
        <TriggerEditMode
          renderAttributeFields={() => baseEditMode}
          attributeName={this.attribute_def.name || ''}
          currentValue={trigger}
          isActive={isTriggerActive}
          isSaving={isTriggerSaving}
          subject={triggerSubject}
          sendBefore={triggerSendBefore}
          selectedTemplate={triggerSelectedTemplate}
          onChangeActive={this.onChangeTriggerActive}
          onChangeSubject={this.onChangeSubject}
          onChangeSendBefore={this.onChangeSendBefore}
          onChangeTemplate={this.onChangeTemplate}
          disabled={!contact?.email}
        />
      )
    }

    return baseEditMode
  }

  renderViewMode = () => {
    const { currentTrigger } = this.state
    const { trigger: triggerFromParent } = this.props
    const trigger = triggerFromParent || currentTrigger

    return (
      <ViewMode
        is_primary={this.state.is_primary}
        name={this.attribute_def.name || ''}
        title={this.title}
        value={formatValue(this.attribute_def, this.state.value)}
        isTriggerable={this.isTriggerable}
        isTriggerActive={Boolean(trigger)}
      />
    )
  }

  render() {
    const { disabled, isDirty, label, error } = this.state

    if (!this.attribute_def.editable) {
      return (
        <div style={{ margin: '0 -0.5em', padding: '0.5em' }}>
          {this.renderViewMode()}
        </div>
      )
    }

    return (
      <InlineEditableField
        error={error}
        cancelOnOutsideClick
        handleAddNew={this.addInstance}
        handleCancel={this.cancel}
        handleDelete={this.handleDelete}
        handleOutsideClick={this.handleOutsideClick}
        handleSave={this.save}
        isDisabled={disabled || !isDirty}
        isEditing={this.props.isActive}
        isPopoverMode={this.isTriggerable}
        isEditModeStatic
        label={label}
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

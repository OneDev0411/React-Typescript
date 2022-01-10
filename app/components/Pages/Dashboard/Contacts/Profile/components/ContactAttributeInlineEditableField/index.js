import { Component } from 'react'

import { connect } from 'react-redux'

import { excludeContactFromGlobalTrigger } from '@app/models/instant-marketing/global-triggers'
import {
  createTrigger,
  updateTrigger,
  removeTrigger
} from '@app/models/instant-marketing/triggers'
import { createTemplateInstance } from '@app/models/instant-marketing/triggers/helpers'
import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'
import { selectGlobalTriggersAttributes } from 'selectors/globalTriggers'
import { noop } from 'utils/helpers'

import { TRIGGERABLE_ATTRIBUTES, TRIGGERING_TIME } from './constants'
import { EditMode } from './EditMode'
import {
  getTitle,
  getValue,
  parseValue,
  validation as validationAttrFields,
  formatValue,
  getPlaceholder,
  getStateFromTrigger,
  validateTriggerFields,
  getInitialErrorMessage
} from './helpers'
import { TriggerEditMode } from './TriggerEditMode'
import { ViewMode } from './ViewMode'

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

const getInitialState = ({
  contact,
  attribute,
  trigger,
  attributeGlobalTrigger
}) => {
  const isTriggerable =
    TRIGGERABLE_ATTRIBUTES.includes(attribute.attribute_def.name) &&
    !attribute?.is_partner

  return {
    contact,
    error: getInitialErrorMessage(contact, isTriggerable),
    isDirty: false,
    isTriggerFieldDirty: false,
    isTriggerSaving: false,
    disabled: false,
    ...getStateFromTrigger(trigger, attributeGlobalTrigger, contact, attribute),
    ...getStateFromAttribute(attribute)
  }
}

function diffAttributeStateWithProp(attribute, state) {
  const { label, value, is_primary } = getStateFromAttribute(attribute)

  return (
    is_primary !== state.is_primary ||
    label !== state.label ||
    value !== state.value
  )
}

class MasterField extends Component {
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
      (!props.isActive &&
        props.attribute?.updated_at &&
        props.attribute?.updated_at > state.updated_at) ||
      props.contact?.email !== state.contact?.email ||
      (!props.trigger && state.currentTrigger) ||
      (!state.currentTrigger && props.trigger)
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

  get isPartner() {
    return this.props.attribute?.is_partner
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

  onChangeSender = value =>
    this.setState({
      isDirty: true,
      isTriggerFieldDirty: true,
      triggerSender: value
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

  handleValidationBeforeSave = async () => {
    const { attribute, trigger: triggerFromParent } = this.props

    if (!this.isDirty) {
      const error = attribute.id ? 'Update value!' : 'Change something!'

      return error
    }

    const error = await validationAttrFields(
      this.attribute_def,
      this.state.value
    )

    if (error) {
      return error
    }

    // Validate Trigger Field
    const {
      currentTrigger,
      isTriggerFieldDirty,
      triggerSubject,
      triggerSendBefore,
      triggerSelectedTemplate
    } = this.state
    const trigger = triggerFromParent || currentTrigger
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
        return error
      }
    }

    return null
  }

  handleSaveTrigger = async () => {
    const {
      user,
      brand,
      contact,
      attributeGlobalTrigger,
      trigger: triggerFromParent
    } = this.props
    const {
      currentTrigger,
      isTriggerFieldDirty,
      isTriggerActive,
      triggerSender,
      triggerSubject,
      triggerSendBefore,
      triggerSelectedTemplate
    } = this.state
    const trigger = triggerFromParent || currentTrigger
    const shouldCheckTriggerField = this.isTriggerable && isTriggerFieldDirty

    if (!shouldCheckTriggerField) {
      return
    }

    if (!isTriggerActive) {
      if (trigger) {
        await removeTrigger(trigger.id)
      }

      if (attributeGlobalTrigger) {
        await excludeContactFromGlobalTrigger(
          contact.id,
          this.attribute_def.name,
          brand?.id
        )
      }

      return
    }

    /*
    since we can create a trigger from global trigger data and
    they also accept brand templates we should check the type of template
    to make sure it's a template instance and if not create an instance from it
    because we just need a template instance for contact trigger.
    */
    this.setState({ isTriggerSaving: true })

    const template =
      triggerSelectedTemplate.type === 'template_instance'
        ? triggerSelectedTemplate
        : await createTemplateInstance(triggerSelectedTemplate, brand, { user })

    const triggerCommonParams = [
      contact,
      template,
      {
        recurring: true,
        time: TRIGGERING_TIME, // it's hard coded base api team comment
        sender: triggerSender,
        subject: triggerSubject,
        wait_for: triggerSendBefore,
        event_type: this.attribute_def.name
      }
    ]

    if (trigger) {
      await updateTrigger(trigger, ...triggerCommonParams)

      return
    }

    await createTrigger(...triggerCommonParams)
  }

  handleSaveAttribute = () => {
    const { attribute } = this.props
    const { is_primary, label, value } = this.state
    const { id, cuid } = attribute

    const payload = {
      cuid,
      id,
      label: label === '' ? null : label,
      [this.type]: parseValue(value, this.attribute_def)
    }

    if (is_primary !== this.props.attribute.is_primary) {
      payload.is_primary = is_primary
    }

    this.props.handleSave(attribute, payload)
  }

  save = async (callback = noop) => {
    const error = await this.handleValidationBeforeSave()

    if (error) {
      return this.setState({ error })
    }

    try {
      this.setState({ disabled: true, error: '' })

      this.setState(
        { disabled: false, isDirty: false, isTriggerSaving: false },
        this.toggleMode
      )
      await this.handleSaveTrigger()
      this.handleSaveAttribute()
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
      // eslint-disable-next-line max-len
      description: `You have made changes, are you sure about deleting "${title}" field?`
    }

    if (this.isDirty) {
      this.context.setConfirmationModal(options)
    } else if (this.props.attribute[this.attribute_def.data_type]) {
      this.context.setConfirmationModal({
        ...options,
        // eslint-disable-next-line max-len
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
    const {
      trigger: triggerFromParent,
      attributeGlobalTrigger,
      attribute,
      contact
    } = this.props
    const {
      triggerSender,
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
          attributeGlobalTrigger={attributeGlobalTrigger}
          currentValue={trigger}
          isActive={isTriggerActive}
          isSaving={isTriggerSaving}
          subject={triggerSubject}
          sender={triggerSender}
          sendBefore={triggerSendBefore}
          selectedTemplate={triggerSelectedTemplate}
          onChangeActive={this.onChangeTriggerActive}
          onChangeSubject={this.onChangeSubject}
          onChangeSender={this.onChangeSender}
          onChangeSendBefore={this.onChangeSendBefore}
          onChangeTemplate={this.onChangeTemplate}
          disabled={!contact?.email}
        />
      )
    }

    return baseEditMode
  }

  renderViewMode = () => {
    const { currentTrigger, is_primary, value } = this.state
    const { trigger: triggerFromParent } = this.props
    const trigger = triggerFromParent || currentTrigger
    const isDateAlreadySet = !!(
      typeof value === 'object' &&
      (value.month?.value || value.day?.value)
    )

    return (
      <ViewMode
        is_primary={is_primary}
        name={this.attribute_def.name || ''}
        title={this.title}
        value={formatValue(this.attribute_def, value)}
        isTriggerable={this.isTriggerable}
        isTriggerActive={Boolean(trigger) && isDateAlreadySet}
      />
    )
  }

  render() {
    const { contact } = this.props
    const { disabled, isDirty, label, error } = this.state

    if (!this.attribute_def.editable) {
      return <div style={{ padding: '0.5em' }}>{this.renderViewMode()}</div>
    }

    return (
      <InlineEditableField
        showDelete
        isEditModeStatic
        cancelOnOutsideClick
        isPartner={this.isPartner}
        error={error}
        contact={contact}
        label={label}
        value={this.state.value}
        attributeName={this.attribute_def.name || ''}
        handleAddNew={this.addInstance}
        handleCancel={this.cancel}
        handleDelete={this.handleDelete}
        handleOutsideClick={this.handleOutsideClick}
        handleSave={this.save}
        isDisabled={disabled || !isDirty}
        isEditing={this.props.isActive}
        isPopoverMode={this.isTriggerable}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showAdd={this.showAdd}
        toggleMode={this.toggleMode}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: selectUser(state),
    brand: selectActiveBrand(state),
    attributeGlobalTrigger:
      selectGlobalTriggersAttributes(state)[
        props.attribute?.attribute_def?.name
      ] ?? null
  }
}

export default connect(mapStateToProps)(MasterField)

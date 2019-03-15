import React from 'react'
import { connect } from 'react-redux'

import { confirmation } from 'actions/confirmation'
import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import {
  formatValue,
  getTitle,
  getValue,
  parseValue,
  validation
} from './helpers'

import { EditMode } from './EditMode'
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
      value: getValue(attribute) || ''
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

    const { attribute } = props

    this.showAdd = !attribute.attribute_def.singular
    this.type = attribute.attribute_def.data_type
    this.state = getInitialState(attribute)
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

  get attributePropsFromState() {
    const { is_primary, label } = this.state

    return {
      label,
      is_primary,
      [this.type]: this.state.value
    }
  }

  get title() {
    return getTitle(this.props.attribute.attribute_def, this.state.label)
  }

  get isDrity() {
    return (
      this.state.isDrity &&
      diffAttributeStateWithProp(this.props.attribute, this.state)
    )
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
      this.props.dispatch(
        confirmation({
          show: true,
          confirmLabel: 'Yes, I do',
          message: 'Heads up!',
          description: 'You have made changes, do you want to discard them?',
          onConfirm: this.setInitialState
        })
      )
    } else {
      this.setInitialState()
    }
  }

  save = async () => {
    const { is_primary, label, value } = this.state
    const { id, cuid, attribute_def } = this.props.attribute

    if (!this.isDrity) {
      return this.setState({ error: id ? 'Update value!' : 'Input something!' })
    }

    const error = await validation(attribute_def, value)

    if (error) {
      return this.setState({ error })
    }

    try {
      this.setState({ disabled: true, error: '' })

      const data = {
        cuid,
        id,
        label,
        [this.type]: parseValue(value, attribute_def)
      }

      if (is_primary !== this.props.attribute.is_primary) {
        data.is_primary = is_primary
      }

      this.props.handleSave(attribute_def, data)

      this.setState({ disabled: false, isDrity: false }, this.toggleMode)
    } catch (error) {
      console.error(error)
      this.setState({ disabled: false, error: error.message })
    }
  }

  delete = async () => {
    try {
      await this.props.handleDelete(this.props.attribute)
    } catch (error) {
      console.error(error)
    }
  }

  handleDelete = () => {
    const { attribute } = this.props
    const title = attribute.attribute_def.label

    const options = {
      show: true,
      confirmLabel: 'Yes, I do',
      message: `Delete ${title}`,
      description: `You have made changes, are you sure about deleting "${title}" field?`,
      onConfirm: this.delete
    }

    if (this.isDrity) {
      this.props.dispatch(
        confirmation({
          ...options,
          description: `You have made changes, are you sure about the deleting "${title}" field?`
        })
      )
    } else if (attribute[attribute.attribute_def.data_type]) {
      this.props.dispatch(
        confirmation({
          ...options,
          description: `Are you sure about deleting "${title}" field, you will lose it forever?`
        })
      )
    } else {
      this.delete()
    }
  }

  addInstance = () => {
    this.props.handleAddNewInstance(this.props.attribute)
  }

  renderEditMode = props => (
    <EditMode
      {...props}
      attribute={{
        ...this.props.attribute,
        ...this.state,
        [this.type]: this.state.value
      }}
      onChangeLabel={this.onChangeLabel}
      onChangeValue={this.onChangeValue}
      onChangePrimary={this.onChangePrimary}
    />
  )

  renderViewMode = () => (
    <ViewMode
      is_primary={this.state.is_primary}
      title={this.title}
      value={formatValue(this.props.attribute.attribute_def, this.state.value)}
    />
  )

  render() {
    if (!this.props.attribute.attribute_def.editable) {
      return (
        <div style={{ margin: '0 -0.5em 1em', padding: '0.5em' }}>
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
        isEditModeStatic
        label={this.state.label}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showAdd={this.showAdd}
        showDelete
        style={{ margin: '0 -0.5em 1em' }}
        toggleMode={this.toggleMode}
        value={this.state.value}
      />
    )
  }
}

export default connect()(MasterField)

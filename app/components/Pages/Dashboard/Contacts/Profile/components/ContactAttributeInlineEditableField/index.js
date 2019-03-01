import React from 'react'
import { connect } from 'react-redux'

import { confirmation } from 'actions/confirmation'
import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { formatValue, getTitle, getValue } from './helpers'

import { EditMode } from './EditMode'
import { ViewMode } from './ViewMode'

function getStateFromAttribute(attribute) {
  if (attribute) {
    return {
      label: attribute.label || '',
      is_primary: attribute.is_primary,
      value: getValue(attribute) || ''
    }
  }

  return {
    label: '',
    value: '',
    is_primary: false
  }
}

const getInitialState = attribute => ({
  isDrity: false,
  isEditing: false,
  disabled: false,
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

  setInitialState = () => this.setState(getInitialState(this.props.attribute))

  toggleMode = () => this.setState(state => ({ isEditing: !state.isEditing }))

  onChangeLabel = label => this.setState({ label, isDrity: true })

  onChangeValue = value => this.setState({ value, isDrity: true })

  onChangePrimary = () =>
    this.setState(state => ({ is_primary: !state.is_primary, isDrity: true }))

  cancel = () => {
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

  save = () => {
    if (!this.isDrity) {
      return
    }

    const { is_primary, label, value } = this.state
    const { id, attribute_def } = this.props.attribute

    try {
      this.setState({ disabled: true })
      this.props.handleSave({
        attribute_def,
        id,
        is_primary,
        label,
        [this.type]: value
      })

      this.setState({ disabled: false, isDrity: false, isEditing: false })
    } catch (error) {
      console.error(error)
      this.setState({ disabled: false })
    }
  }

  delete = async toggleMode => {
    try {
      this.setState({ disabled: true })
      await this.props.handleDelete(this.props.attribute)

      this.setState(getInitialState(), toggleMode)
    } catch (error) {
      console.error(error)
      this.setState({ disabled: false })
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
        <div style={{ margin: '0 1em 1em', padding: '0.5em' }}>
          {this.renderViewMode()}
        </div>
      )
    }

    return (
      <InlineEditableField
        cancelOnOutsideClick
        handleCancel={this.cancel}
        handleAddNew={this.props.handleAddNew}
        handleDelete={this.delete}
        handleSave={this.save}
        isDisabled={this.state.disabled}
        isEditing={this.state.isEditing}
        label={this.state.label}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showAdd={this.showAdd}
        showDelete
        toggleMode={this.toggleMode}
        value={this.state.value}
      />
    )
  }
}

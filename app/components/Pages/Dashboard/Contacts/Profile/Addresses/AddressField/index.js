import React from 'react'
import { connect } from 'react-redux'

import { confirmation } from 'actions/confirmation'
import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { EditMode } from './EditMode'
import { ViewMode } from './ViewMode'

import { postLoadFormat, preSaveFormat, getUpsertAttributes } from './helpers'

const DEFAULT_LABEL = { label: 'Select', value: '' }

function destructuringAddress(address) {
  let { label, full_address, is_primary } = address

  if (!label) {
    label = address.id ? DEFAULT_LABEL : { label: 'Home', value: 'Home' }
  } else {
    label = { label, value: label }
  }

  return {
    address: full_address || '',
    is_primary,
    label
  }
}

function getInitialState(address = {}) {
  return {
    isDisabled: false,
    ...destructuringAddress(address)
  }
}

function diffAddressStateWithProp(props, state) {
  console.log(props, state)

  return (
    props.address.full_address !== state.address ||
    props.address.is_primary !== state.is_primary ||
    (props.address.label && props.address.label !== state.label.value) ||
    (!props.address.label && state.label.value && state.address)
  )
}

class AddressField extends React.Component {
  constructor(props) {
    super(props)

    this.state = getInitialState(props.address)

    this.labels = [
      DEFAULT_LABEL,
      ...props.address.labels.map(label => ({ label, value: label }))
    ]
  }

  static getDerivedStateFromProps(props, state) {
    const { address } = props

    if (
      !state.isDisabled &&
      !props.address.isActive &&
      diffAddressStateWithProp(props, state)
    ) {
      return getInitialState(address)
    }

    return null
  }

  toggleMode = () => this.props.toggleMode(this.props.address)

  cancel = () => {
    if (this.state.isDisabled) {
      return
    }

    if (diffAddressStateWithProp(this.props, this.state)) {
      this.props.dispatch(
        confirmation({
          show: true,
          confirmLabel: 'Yes, I do',
          message: 'Heads up!',
          description: 'You have made changes, do you want to discard them?',
          onConfirm: this.toggleMode
        })
      )
    } else {
      this.toggleMode()
    }
  }

  delete = async () => {
    this.setState({ isDisabled: true })

    const attributeIds = this.props.address.attributes
      .filter(attribute => attribute.id)
      .map(attribute => attribute.id)

    try {
      await this.props.handleDelete(this.props.address.index, attributeIds)

      this.setState({ isDisabled: false }, this.toggle)
    } catch (error) {
      console.error(error)
      this.setState({ isDisabled: false }, this.toggle)
    }
  }

  onChangeLabel = label => this.setState({ label })

  onChangePrimary = () =>
    this.setState(state => ({ is_primary: !state.is_primary }))

  handleDelete = () => {
    const options = {
      show: true,
      confirmLabel: 'Yes, I do',
      message: 'Delete Address',
      description:
        'You have made changes, are you sure about deleting this address?',
      onConfirm: this.delete
    }

    if (diffAddressStateWithProp(this.props, this.state)) {
      this.props.dispatch(
        confirmation({
          ...options,
          description:
            'You have made changes, are you sure about the deleting this address?'
        })
      )
    } else if (this.props.address.full_address) {
      this.props.dispatch(
        confirmation({
          ...options,
          description:
            'Are you sure about deleting this address, you will lose it forever?'
        })
      )
    } else {
      this.delete()
    }
  }

  handleSubmit = async (values = {}) => {
    const {
      is_primary,
      label: { value: label }
    } = this.state

    const upsertList = getUpsertAttributes(
      {
        label,
        values,
        is_primary
      },
      destructuringAddress(this.props.address),
      this.props.address.attributes
    )

    if (upsertList.length > 0) {
      this.setState({ isDisabled: true })

      try {
        await this.props.handleSubmit(upsertList)

        this.setState({ isDisabled: false }, this.toggle)
      } catch (error) {
        console.error(error)
        this.setState({ isDisabled: false }, this.toggle)
      }
    }
  }

  onSubmit = () => this.handleSubmit()

  postLoadFormat = (values, originalValues) =>
    postLoadFormat(values, originalValues, this.props.address)

  renderEditMode = props => (
    <EditMode
      {...props}
      {...this.state}
      handleSubmit={this.handleSubmit}
      labels={this.labels}
      preSaveFormat={preSaveFormat}
      postLoadFormat={this.postLoadFormat}
      onChangeLabel={this.onChangeLabel}
      onChangePrimary={this.onChangePrimary}
    />
  )

  renderViewMode = props => <ViewMode {...props} address={this.props.address} />

  render() {
    return (
      <InlineEditableField
        cancelOnOutsideClick
        handleCancel={this.cancel}
        handleSave={this.onSubmit}
        handleDelete={this.handleDelete}
        handleAddNew={this.props.handleAddNew}
        isDisabled={this.state.isDisabled}
        isEditing={this.props.address.isActive}
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showAdd
        showDelete
        toggleMode={this.toggleMode}
      />
    )
  }
}

export default connect()(AddressField)

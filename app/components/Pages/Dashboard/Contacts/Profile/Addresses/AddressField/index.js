import React from 'react'
import addressParser from 'parse-address'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'
import postLoadFormat from 'components/inline-editable-fields/InlineAddressField/InlineAddressForm/helpers/post-load-format'

import { EditMode } from './EditMode'
import { ViewMode } from './ViewMode'

import { preSaveFormat, getUpsertAttributes } from './helpers'

const DEFAULT_LABEL = { label: 'Select', value: null }

function destructuringAddress(address) {
  let { label, full_address, is_primary } = address

  if (!label) {
    label = address.id ? DEFAULT_LABEL : { label: 'Other', value: 'Other' }
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

  static contextType = ConfirmationModalContext

  toggleMode = () => this.props.toggleMode(this.props.address)

  cancel = () => {
    if (this.state.isDisabled) {
      return
    }

    if (diffAddressStateWithProp(this.props, this.state)) {
      this.context.setConfirmationModal({
        confirmLabel: 'Yes, I do',
        message: 'Heads up!',
        description: 'You have made changes, do you want to discard them?',
        onConfirm: this.toggleMode
      })
    } else {
      this.toggleMode()
    }
  }

  delete = async () => {
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

  onChangeInput = address => this.setState({ address })

  handleDelete = () => {
    this.setState({ isDisabled: true })

    const options = {
      onConfirm: this.delete,
      confirmLabel: 'Yes, I do',
      message: 'Delete Address',
      onCancel: () => this.setState({ isDisabled: false }),
      description:
        'You have made changes, are you sure about deleting this address?'
    }

    if (diffAddressStateWithProp(this.props, this.state)) {
      this.context.setConfirmationModal(options)
    } else if (this.props.address.full_address) {
      this.context.setConfirmationModal({
        ...options,
        description:
          'Are you sure about deleting this address, you will lose it forever?'
      })
    } else {
      this.delete()
    }
  }

  handleSubmit = async values => {
    const {
      address,
      is_primary,
      label: { value: label }
    } = this.state

    if (values == null) {
      if (address !== this.props.address.full_address) {
        values = this.preSaveFormat(
          postLoadFormat(addressParser.parseLocation(this.state.address))
        )
      } else {
        values = {}
      }
    }

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

    return null
  }

  onSubmit = () => this.handleSubmit()

  preSaveFormat = values =>
    preSaveFormat(
      values,
      addressParser.parseLocation(this.props.address.full_address),
      this.props.address
    )

  renderEditMode = props => (
    <EditMode
      {...props}
      {...this.state}
      handleSubmit={this.handleSubmit}
      labels={this.labels}
      preSaveFormat={this.preSaveFormat}
      onChangeLabel={this.onChangeLabel}
      onChangePrimary={this.onChangePrimary}
      onChangeInput={this.onChangeInput}
    />
  )

  renderViewMode = props => <ViewMode {...props} address={this.props.address} />

  render() {
    return (
      <InlineEditableField
        handleAddNew={this.props.handleAddNew}
        handleCancel={this.cancel}
        handleDelete={this.handleDelete}
        handleSave={this.onSubmit}
        isDisabled={this.state.isDisabled}
        isEditing={this.props.address.isActive}
        isEditModeStatic
        renderEditMode={this.renderEditMode}
        renderViewMode={this.renderViewMode}
        showAdd
        showDelete
        toggleMode={this.toggleMode}
      />
    )
  }
}

export default AddressField

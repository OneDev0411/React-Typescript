import React from 'react'
import { connect } from 'react-redux'

import { addNotification } from 'components/notification'

import { getContactAddresses } from 'models/contacts/helpers/get-contact-addresses'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttributesFromContacts } from 'models/contacts/delete-attributes-bulk-contacts'

import { selectDefsBySection } from 'reducers/contacts/attributeDefs'

import AddressField from './AddressField'
import { BasicSection } from '../components/Section/Basic'
import { generateEmptyAddress, getAddresses } from './helpers/get-addresses'

class Addresses extends React.Component {
  constructor(props) {
    super(props)

    const addressAttributeDefs = selectDefsBySection(
      props.attributeDefs,
      'Addresses'
    )

    let defaultLabel = 'Other'
    let defaultIsPrimary = false
    const addresses = getContactAddresses(props.contact)
    const normalizedAddresses = getAddresses(addresses, addressAttributeDefs)

    if (normalizedAddresses.length === 0) {
      defaultLabel = 'Home'
      defaultIsPrimary = true
    }

    this.state = {
      addresses: [
        ...normalizedAddresses,
        generateEmptyAddress(
          addressAttributeDefs,
          addresses,
          false,
          defaultLabel,
          defaultIsPrimary
        )
      ]
    }

    this.addressAttributeDefs = addressAttributeDefs
  }

  toggleAddressActiveMode = ({ index }) =>
    this.setState(state => ({
      addresses: state.addresses.map(a => ({
        ...a,
        isActive: a.index === index ? !a.isActive : a.isActive
      }))
    }))

  addNewAddress = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    this.setState(state => ({
      addresses: [
        ...state.addresses,
        generateEmptyAddress(this.addressAttributeDefs, state.addresses, true)
      ]
    }))
  }

  handleDelete = async (addressIndex, ids) => {
    const removeAddressFromState = () =>
      this.setState(state => {
        const addresses = state.addresses.filter(
          address => address.index !== addressIndex
        )

        if (addresses.length > 1) {
          return { addresses }
        }

        if (addresses.length === 1) {
          const address = addresses[0]

          return {
            addresses: [
              {
                ...address,
                label: address.id ? address.label : 'Home',
                is_primary: address.id ? address.is_primary : true
              }
            ]
          }
        }

        return {
          addresses: [
            generateEmptyAddress(
              this.addressAttributeDefs,
              addresses,
              false,
              'Home',
              true
            )
          ]
        }
      })

    if (ids.length === 0) {
      return removeAddressFromState()
    }

    try {
      await deleteAttributesFromContacts(ids)

      return removeAddressFromState()
    } catch (error) {
      console.error(error)
      this.props.notify({
        message:
          'An error occurred while deleting the address. Please try again.',
        status: 'error'
      })
    }
  }

  handleSubmit = async attributes => {
    try {
      const updatedContact = await upsertContactAttributes(
        this.props.contact.id,
        attributes,
        {
          associations: [
            'contact.attributes',
            'contact.updated_by',
            'contact_attribute.attribute_def'
          ]
        }
      )

      const addresses = getContactAddresses(updatedContact)

      this.setState({
        addresses: getAddresses(addresses, this.addressAttributeDefs)
      })
    } catch (error) {
      console.error(error)
      this.props.notify({
        message:
          'An error occurred while saving the address. Please try again.',
        status: 'error'
      })
    }
  }

  render() {
    return (
      <BasicSection title="Addresses">
        {this.state.addresses.map((address, index) => (
          <AddressField
            key={index}
            address={address}
            handleDelete={this.handleDelete}
            handleSubmit={this.handleSubmit}
            handleAddNew={this.addNewAddress}
            toggleMode={this.toggleAddressActiveMode}
          />
        ))}
      </BasicSection>
    )
  }
}

function mapStateToProps(state) {
  return {
    attributeDefs: state.contacts.attributeDefs
  }
}

// This is using for testing
export { Addresses }
export default connect(mapStateToProps, { notify: addNotification })(Addresses)

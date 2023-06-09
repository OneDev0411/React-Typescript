import React from 'react'

import { connect } from 'react-redux'

import { addNotification } from 'components/notification'
import { deleteAttributesFromContacts } from 'models/contacts/delete-attributes-bulk-contacts'
import { getContactAddresses } from 'models/contacts/helpers/get-contact-addresses'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { selectDefsBySection } from 'reducers/contacts/attributeDefs'

import { BasicSection } from '../components/Section/Basic'

import AddressField from './AddressField'
import { generateEmptyAddress, getAddresses } from './helpers/get-addresses'

function getInitialState(props) {
  const addressAttributeDefs = selectDefsBySection(
    props.attributeDefs,
    'Addresses'
  )

  let defaultLabel
  let defaultIsPrimary = false
  const addresses = getContactAddresses(props.contact)
  const normalizedAddresses = getAddresses(addresses, addressAttributeDefs)

  if (normalizedAddresses.length === 0) {
    defaultLabel = 'Home'
    defaultIsPrimary = true
  }

  return {
    contactId: props.contact?.id,
    addresses: [
      ...normalizedAddresses,
      generateEmptyAddress(
        addressAttributeDefs,
        normalizedAddresses,
        false,
        defaultLabel,
        defaultIsPrimary
      )
    ],
    addressAttributeDefs
  }
}

class Addresses extends React.Component {
  constructor(props) {
    super(props)

    this.state = getInitialState(props)
  }

  static getDerivedStateFromProps(props, state) {
    if (state.contactId && state.contactId !== props.contact?.id) {
      return getInitialState(props)
    }

    return state
  }

  toggleAddressActiveMode = ({ index }) => {
    this.setState(state => ({
      addresses: state.addresses.map(a => ({
        ...a,
        isActive: a.index === index ? !a.isActive : a.isActive
      }))
    }))
  }

  addNewAddress = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    this.setState(state => ({
      addresses: [
        ...state.addresses,
        generateEmptyAddress(state.addressAttributeDefs, state.addresses, true)
      ]
    }))
  }

  handleDelete = async (addressIndex, ids, listIndex) => {
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
              state.addressAttributeDefs,
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

      const addNewAddress = this.props.contact.address?.filter(
        (_, index) => index !== listIndex
      )

      this.props.submitCallback(
        {
          ...this.props.contact,
          address: addNewAddress.length ? addNewAddress : null
        },
        this.state.addressAttributeDefs
      )

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

      this.setState(state => ({
        addresses: getAddresses(addresses, state.addressAttributeDefs)
      }))

      this.props.submitCallback(updatedContact, attributes)
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
            handleDelete={(...e) => this.handleDelete(...e, index)}
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

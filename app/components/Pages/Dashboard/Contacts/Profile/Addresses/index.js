import React from 'react'
import { connect } from 'react-redux'

import { getContactAddresses } from 'models/contacts/helpers/get-contact-addresses'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttributesFromContacts } from 'models/contacts/delete-attributes-bulk-contacts'

import { selectDefsBySection } from 'reducers/contacts/attributeDefs'

import AddressField from './AddressField'
import { Section } from '../components/Section'
import { generateEmptyAddress, getAddresses } from './helpers/get-addresses'

class Addresses extends React.Component {
  constructor(props) {
    super(props)

    const addressAttributeDefs = selectDefsBySection(
      props.attributeDefs,
      'Addresses'
    )

    const addresses = getContactAddresses(props.contact)

    this.state = {
      addresses: [
        ...getAddresses(addresses, addressAttributeDefs),
        generateEmptyAddress(addressAttributeDefs, addresses)
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

        if (addresses.length > 0) {
          return { addresses }
        }

        return {
          addresses: [
            generateEmptyAddress(this.addressAttributeDefs, addresses)
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
    }
  }

  render() {
    return (
      <Section title="Addresses" isNew>
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
      </Section>
    )
  }
}

function mapStateToProps(state) {
  return {
    attributeDefs: state.contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(Addresses)

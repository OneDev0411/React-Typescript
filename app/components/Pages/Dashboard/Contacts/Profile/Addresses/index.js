import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'

import { getContactAddresses } from '../../../../../../models/contacts/helpers/get-contact-addresses'

import { selectDefsBySection } from '../../../../../../reducers/contacts/attributeDefs'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import Tooltip from '../../../../../../views/components/tooltip'
import StarIcon from '../../../../../../views/components/SvgIcons/Star/StarIcon'

import EditForm from './EditFormDrawer'
import { Section } from '../components/Section'

class Addresses extends React.Component {
  state = {
    isOpenEditDrawer: false
  }

  openEditDrawer = () => this.setState({ isOpenEditDrawer: true })
  closeEditDrawer = () => {
    if (this.state.isSaving) {
      return
    }

    this.setState({ isOpenEditDrawer: false })
  }

  getFullAddressString(fields) {
    // Address Fields Indexed By Name
    const idxName = {}

    fields.forEach(field => {
      idxName[field.attribute_type] = field[field.attribute_def.data_type]
    })

    let fullAddress = `${idxName.street_number} ${idxName.street_prefix} ${
      idxName.street_name
    } ${idxName.street_suffix}`

    if (idxName.unit_number) {
      fullAddress = `${fullAddress}, Unit ${idxName.unit_number}`
    }

    fullAddress = `${fullAddress}, ${idxName.city} ${idxName.state} ${
      idxName.postal_code
    }`

    return fullAddress.replace('  ', ' ').trim()
  }

  getSectionContent = addresses => {
    const addressesItems = addresses.map(address => [
      <dt
        key={`address_${address.index}_label`}
        style={{
          color: '#758a9e',
          fontWeight: '500',
          marginBottom: '0.25em',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {address.label}
        {address.is_primary && (
          <Tooltip caption="Primary">
            <StarIcon
              style={{
                fill: '#f5a623',
                width: '16px',
                height: '16px',
                marginLeft: '5px'
              }}
            />
          </Tooltip>
        )}
      </dt>,
      <dd
        key={`address_${address.index}_value`}
        style={{
          color: '#17283a',
          marginBottom: '1em'
        }}
      >
        {this.getFullAddressString(address.fields)}
      </dd>
    ])

    return <dl>{addressesItems}</dl>
  }

  render() {
    const { addresses } = this.props
    const hasAddresses = addresses.length > 0

    return (
      <Section
        // onEdit={hasAddresses ? this.openEditDrawer : undefined}
        title="Addresses"
      >
        {addresses.length > 0 ? (
          this.getSectionContent(addresses)
        ) : (
          <div
            style={{
              textAlign: 'center',
              marginTop: hasAddresses ? 0 : '0.5em',
              marginBottom: '1.5em'
            }}
          >
            <ActionButton inverse onClick={() => {}}>
              Add Address
            </ActionButton>
          </div>
        )}

        <EditForm
          addresses={this.props.addresses}
          isOpen={this.state.isOpenEditDrawer}
          onClose={this.closeEditDrawer}
        />
      </Section>
    )
  }
}

function mapStateToProps(state, props) {
  const { attributeDefs } = state.contacts
  const addressesFields = getContactAddresses(props.contact)
  const addressAttributeDefs = selectDefsBySection(attributeDefs, 'Addresses')
  const addresses = getAddresses(addressAttributeDefs, addressesFields)

  return { addressesFields, addresses, addressAttributeDefs }
}

export default connect(mapStateToProps)(Addresses)

function getAddresses(addressAttributeDefs, addressesFields) {
  if (addressesFields.length === 0) {
    return []
  }

  let addresses = []

  const idxAddresses = _.groupBy(addressesFields, 'index')

  _.each(idxAddresses, address => {
    const fields = address.filter(field => field.attribute_def.show)

    const { label, index, is_primary } = fields[0]

    addresses.push({ index, label, fields, is_primary })
  })

  return addresses
}

// function getIndex(addressesFields) {
//   if (addressesFields.length > 0) {
//     const index = addressesFields
//       .filter(({ index }) => index != null)
//       .map(({ index }) => index)
//       .reduce((a, b) => (a >= b ? a : b))

//     return index + 1
//   }

//   return 0
// }

// withHandlers({
//   onChange: ({
//     contact,
//     setDisabled,
//     upsertContactAttributes
//   }) => async field => {
//     try {
//       setDisabled(true)

//       let attribute
//       const { data_type } = field.attribute_def

//       if (field.id) {
//         attribute = {
//           id: field.id,
//           [data_type]: field[data_type]
//         }
//       } else {
//         attribute = {
//           index: field.index,
//           [data_type]: field[data_type],
//           attribute_def: field.attribute_def.id
//         }
//       }

//       await upsertContactAttributes(contact.id, [attribute])
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   handleOnChangeLabel: ({
//     contact,
//     setDisabled,
//     addressesFields,
//     upsertContactAttributes
//   }) => async ({ index, label }) => {
//     if (index == null) {
//       throw new Error(`The index is ${index}`)
//     }

//     if (label == null) {
//       throw new Error(`The label is ${index}`)
//     }

//     const attributes = addressesFields
//       .filter(field => field.index === index)
//       .map(field => ({ ...field, label }))

//     try {
//       setDisabled(true)
//       await upsertContactAttributes(contact.id, attributes)
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   handelOnChangePrimary: ({
//     contact,
//     setDisabled,
//     addressesFields,
//     upsertContactAttributes
//   }) => async index => {
//     try {
//       setDisabled(true)

//       const attributes = addressesFields.map(field => {
//         if (field.index === index) {
//           return { ...field, is_primary: true }
//         }

//         return { ...field, is_primary: false }
//       })

//       await upsertContactAttributes(contact.id, attributes)
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   onDelete: ({
//     contact,
//     setDisabled,
//     upsertContactAttributes
//   }) => async attribute => {
//     try {
//       setDisabled(true)

//       const attributes = [
//         {
//           ...attribute,
//           [attribute.attribute_def.data_type]: ''
//         }
//       ]

//       await upsertContactAttributes(contact.id, attributes)
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   handleDeleteAddress: ({
//     contact,
//     setDisabled,
//     deleteAttributes
//   }) => async fields => {
//     setDisabled(true)

//     try {
//       const ids = fields
//         .filter(field => field && field.id)
//         .map(({ id }) => id)

//       await deleteAttributes(contact.id, ids)
//     } catch (error) {
//       throw error
//     } finally {
//       setDisabled(false)
//     }
//   }
// }),
// withHandlers({
//   handleAddNewAddress: ({
//     contact,
//     setDisabled,
//     setShowModal,
//     attributeDefs,
//     addressesFields,
//     upsertContactAttributes
//   }) => async values => {
//     try {
//       setDisabled(true)

//       const attributes = []
//       const index = getIndex(addressesFields)

//       Object.keys(values).forEach(key => {
//         if (values[key]) {
//           const attribute_def = selectDefinitionByName(attributeDefs, key)

//           if (attribute_def) {
//             attributes.push({
//               index,
//               attribute_def,
//               label: values.label,
//               is_primary: values.is_primary,
//               [attribute_def.data_type]: values[key]
//             })
//           }
//         }
//       })

//       addressesFields.forEach(attribute => {
//         attributes.push({
//           ...attribute,
//           is_primary: false
//         })
//       })

//       await upsertContactAttributes(contact.id, attributes)
//     } catch (error) {
//       setDisabled(false)
//       throw error
//     } finally {
//       setDisabled(false)
//       setShowModal(false)
//     }
//   }
// })

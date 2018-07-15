import React from 'react'
import { connect } from 'react-redux'

import { getContactAddresses } from '../../../../../../models/contacts/helpers/get-contact-addresses'

import { selectDefsBySection } from '../../../../../../reducers/contacts/attributeDefs'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import Tooltip from '../../../../../../views/components/tooltip'
import StarIcon from '../../../../../../views/components/SvgIcons/Star/StarIcon'

import EditForm from './EditFormDrawer'
import { Section } from '../components/Section'
import { getAddresses, getFullAddress } from './helpers'

class Addresses extends React.Component {
  state = {
    isOpenEditDrawer: false
  }

  openEditDrawer = () => this.setState({ isOpenEditDrawer: true })
  closeEditDrawer = () => this.setState({ isOpenEditDrawer: false })

  getSectionContent = addresses => {
    let addressesItems = []

    addresses.forEach(address => {
      if (!address.fields.some(field => field[field.attribute_def.data_type])) {
        return
      }

      const item = [
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
          {getFullAddress(address.fields)}
        </dd>
      ]

      addressesItems.push(item)
    })

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
  const addressAttributeDefs = selectDefsBySection(
    state.contacts.attributeDefs,
    'Addresses'
  )
  const addressesFields = getContactAddresses(props.contact)
  const addresses = getAddresses(addressesFields, addressAttributeDefs)

  return { addresses }
}

export default connect(mapStateToProps)(Addresses)

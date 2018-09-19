import React from 'react'
import { connect } from 'react-redux'

import { getContactAddresses } from '../../../../../../models/contacts/helpers/get-contact-addresses'

import { selectDefsBySection } from '../../../../../../reducers/contacts/attributeDefs'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import Tooltip from '../../../../../../views/components/tooltip'
import StarIcon from '../../../../../../views/components/SvgIcons/Star/StarIcon'

import EditDrawer from './EditAddressesDrawer'
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
            color: '#7f7f7f',
            fontWeight: '300',
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

    const hasAddresses =
      addresses.length > 0 &&
      addresses[0].fields.some(field => field[field.attribute_def.data_type])

    return (
      <Section
        onEdit={hasAddresses ? this.openEditDrawer : undefined}
        title="Addresses"
      >
        {hasAddresses ? (
          this.getSectionContent(addresses)
        ) : (
          <div
            style={{
              marginTop: hasAddresses ? 0 : '0.5em'
            }}
          >
            <ActionButton
              appearance="outline"
              onClick={this.openEditDrawer}
              size="small"
            >
              Add Address
            </ActionButton>
          </div>
        )}

        <EditDrawer
          addresses={this.props.addresses}
          addressAttributeDefs={this.props.addressAttributeDefs}
          contact={this.props.contact}
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

  return { addresses, addressAttributeDefs }
}

export default connect(mapStateToProps)(Addresses)

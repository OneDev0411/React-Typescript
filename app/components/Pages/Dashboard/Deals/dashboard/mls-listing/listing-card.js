import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { browserHistory } from 'react-router'
import ManualAddress from '../../create/manual-address'
import Deal from '../../../../../../models/Deal'
import { updateContext } from '../../../../../../store_actions/deals'

class ListingCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSavingAddress: false,
      showAddressModal: false
    }
  }

  getAddressField(deal, field) {
    if (deal.listing) {
      return deal.mls_context[field]
    }

    return Deal.get.field(deal, field)
  }

  getHomeAddress(deal) {
    const unitNumber = this.getAddressField(deal, 'unit_number')
    const street_number = this.getAddressField(deal, 'street_number')
    const street_name = this.getAddressField(deal, 'street_name')
    const street_suffix = this.getAddressField(deal, 'street_suffix')

    return [
      street_number,
      street_name,
      street_suffix,
      unitNumber ? `, #${unitNumber}` : null
    ]
      .filter(item => item !== null)
      .join(' ')
  }

  getListingAddress(deal) {
    const city = this.getAddressField(deal, 'city')
    const state = this.getAddressField(deal, 'state_code')
    const postalCode = this.getAddressField(deal, 'postal_code')

    const address = [
      city ? `${city},` : null,
      state,
      postalCode
    ]
      .filter(item => item !== null)
      .join(' ')

    if (address.length === 0) {
      return Deal.get.clientNames(deal, this.props.roles)
    }

    return address
  }

  openListing(deal) {
    if (deal.listing) {
      browserHistory.push(`/dashboard/mls/${deal.listing}`)
    }
  }

  toggleShowAddressModal() {
    this.setState({
      showAddressModal: !this.state.showAddressModal
    })
  }

  async onCreateAddress(address) {
    const { deal } = this.props

    this.setState({
      isSavingAddress: true,
      showAddressModal: false
    })

    address.use_manual_address = true
    await this.props.updateContext(deal.id, address.address_components, true)

    this.setState({
      isSavingAddress: false
    })
  }

  render() {
    const { deal } = this.props
    const { showAddressModal, isSavingAddress } = this.state
    const photo = Deal.get.field(deal, 'photo')

    return (
      <div className="deal-listing-card">
        <div
          className={cn('listing-photo', { hasListing: deal.listing })}
          onClick={() => this.openListing(deal)}
        >
          <img alt="" src={photo || '/static/images/deals/group-146.svg'} />
          <span className="view-btn">VIEW</span>
        </div>

        <div className="address-info">

          <div
            className={cn('editable', { canEdit: !isSavingAddress })}
            onClick={() => !isSavingAddress && this.toggleShowAddressModal()}
          >
            <div className="title">
              { this.getHomeAddress(deal) }
            </div>

            <div className="addr">
              { this.getListingAddress(deal) }
            </div>

            <i className="fa fa-pencil edit-icon" />
            { isSavingAddress && <i className="fa fa-spin fa-spinner" /> }
          </div>

          <img
            alt=""
            onClick={() => this.openListing(deal)}
            className={cn('open-listing', { hidden: !deal.listing })}
            src="/static/images/deals/view-listing.svg"
          />
        </div>

        <ManualAddress
          show={showAddressModal}
          deal={deal}
          onHide={() => this.toggleShowAddressModal()}
          onCreateAddress={address => this.onCreateAddress(address)}
        />
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  roles: deals.roles
}), { updateContext })(ListingCard)

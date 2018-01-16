import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import cn from 'classnames'
import { browserHistory } from 'react-router'
import ManualAddress from '../../create/manual-address'
import Deal from '../../../../../../models/Deal'
import { updateContext } from '../../../../../../store_actions/deals'

const WARNING_MESSAGE =
  'Listing information can only be changed on MLS. Once changed, the update will be reflected here.'

class ListingCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSavingAddress: false,
      showAddressModal: false,
      showWarningTooltip: false
    }

    this._setWarningTooltipState = this._setWarningTooltipState.bind(this)
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

    const address = [city ? `${city},` : null, state, postalCode]
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

  _setWarningTooltipState(showWarningTooltip) {
    this.setState({
      showWarningTooltip
    })
  }

  render() {
    const { deal } = this.props
    const { showWarningTooltip, showAddressModal, isSavingAddress } = this.state
    const photo = Deal.get.field(deal, 'photo')
    const showEditingAddressWarning = deal.listing && showWarningTooltip

    const homeAddress = this.getHomeAddress(deal)
    const listingAddress = this.getListingAddress(deal)

    return (
      <div className="deal-listing-card">
        <button
          className={cn('c-button--shadow listing-photo', {
            hasListing: deal.listing
          })}
          onClick={() => this.openListing(deal)}
        >
          <img alt="" src={photo || '/static/images/deals/group-146.svg'} />
          <span className="view-btn">VIEW</span>
        </button>

        <div className="address-info">
          <button
            disabled={deal.listing}
            onClick={() => !isSavingAddress && this.toggleShowAddressModal()}
            onMouseEnter={() => this._setWarningTooltipState(true)}
            onMouseLeave={() => this._setWarningTooltipState(false)}
            className={cn('deal-listing-card__address c-button--shadow', {
              isHovered: showEditingAddressWarning,
              'is-editable': !deal.listing
            })}
          >
            {homeAddress && <div className="title">{homeAddress}</div>}

            {listingAddress && <div className="addr">{listingAddress}</div>}

            {showEditingAddressWarning && (
              <div className="deal-listing-card__warning-tooltip">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 72 90"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.81 34.66V23.93C7.81 10.715 20.505 0 36.172 0c15.663 0 28.362 10.711 28.362 23.93l-.003 5.363v5.364h2.418c2.644 0 4.804 2.168 4.804 4.808v45.73c0 2.64-2.164 4.805-4.804 4.805l-62.141-.004C2.164 89.996 0 87.828 0 85.191v-45.73c0-2.64 2.164-4.8 4.809-4.8l3-.001zm47.421 0V23.93c0-7.828-8.535-14.18-19.055-14.18-10.523 0-19.059 6.352-19.059 14.18v10.73h38.114z"
                    fill="#adadad"
                    fillRule="evenodd"
                  />
                </svg>
                <span>{WARNING_MESSAGE}</span>
              </div>
            )}
          </button>

          {deal.listing && (
            <Link className="open-listing" to={`/dashboard/mls/${deal.listing}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                className="deal-listing-card__open-link-icon"
                fill="#C9D7DF"
                fillRule="evenodd"
              >
                <path d="M14 16c1.103 0 2-.897 2-2v-4h-2v4H2V2h4V0H2C.897 0 0 .897 0 2v12c0 1.103.897 2 2 2h12z" />
                <path d="M9 2h3.586L5.293 9.293l1.414 1.414L14 3.414V7h2V0H9z" />
              </svg>
            </Link>
          )}
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

export default connect(
  ({ deals }) => ({
    roles: deals.roles
  }),
  { updateContext }
)(ListingCard)

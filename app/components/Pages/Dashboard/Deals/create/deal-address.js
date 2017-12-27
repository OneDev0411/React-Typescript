import React from 'react'
import ManualAddress from './manual-address'
import MlsSearch from '../dashboard/mls-listing/search'

const BUYING = 'Buying'

export default class DealAddress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showManualAddress: false,
      showMlsSearch: false
    }
  }

  toggleManualAddressModal() {
    this.setState({
      showManualAddress: !this.state.showManualAddress
    })
  }

  toggleMlsModal() {
    this.setState({
      showMlsSearch: !this.state.showMlsSearch
    })
  }

  onCreateAddress(address) {
    this.setState({
      showManualAddress: false,
      showMlsSearch: false
    })

    this.props.onCreateAddress(address, 'address')
  }

  getListingImage(address) {
    return address.image || '/static/images/deals/home.svg'
  }

  render() {
    const { showManualAddress, showMlsSearch } = this.state
    const { dealAddress, dealSide, onRemoveAddress } = this.props

    return (
      <div className="form-section deal-address">
        <div className="hero">
          Do you have an address for this deal?
        </div>

        <ManualAddress
          show={showManualAddress}
          onHide={() => this.toggleManualAddressModal()}
          onCreateAddress={address => this.onCreateAddress(address)}
        />

        <MlsSearch
          modalTitle="Address"
          show={showMlsSearch}
          onHide={() => this.toggleMlsModal()}
          onSelectListing={mls => this.onCreateAddress(mls)}
        />

        {
          dealAddress ?
            <div className="address-info">
              <img
                alt="listing not available"
                src={this.getListingImage(dealAddress)}
              />
              <span className="name">
                {dealAddress.address_components.street_number}&nbsp;
                {dealAddress.address_components.street_name}&nbsp;
                {dealAddress.address_components.street_suffix}
              </span>

              <span
                className="remove-address"
                onClick={onRemoveAddress}
              >
              Remove Address
              </span>
            </div> :
            <div>

              {
                dealSide === BUYING &&
                <div
                  className="entity-item address new"
                  onClick={() => this.toggleMlsModal()}
                >
                  <span className="add-item">
                    <span className="icon">+</span>
                    <span className="text">Add From MLS</span>
                  </span>
                </div>
              }

              <div
                className="entity-item address new"
                onClick={() => this.toggleManualAddressModal()}
              >
                <span className="add-item">
                  <span className="icon">+</span>
                  <span className="text">
                    { dealSide === BUYING ? 'Or add address manually' : 'Add address' }
                  </span>
                </span>
              </div>
            </div>
        }

      </div>
    )
  }
}

import React from 'react'
import { connect } from 'react-redux'
import SearchModal from './search'
import ListingInfo from './info'
import { updateListing } from '../../../../../../store_actions/deals'
import { confirmation } from '../../../../../../store_actions/confirmation'

class MlsListing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      showMlsModal: false
    }
  }

  toggleSearchModal() {
    this.setState({
      showMlsModal: !this.state.showMlsModal
    })
  }

  requestDeleteMls() {
    const { confirmation } = this.props

    confirmation({
      message: 'Delete MLS Listing?',
      description: 'Removing the MLS# will remove the property from your deal.',
      confirmLabel: 'Yes, I am sure',
      onConfirm: () => this.delete()
    })
  }

  delete() {
    const listing = { id: null }

    this.onSelectListing(listing)
  }

  async onSelectListing(listing) {
    const { deal, updateListing } = this.props

    this.setState({
      showMlsModal: false,
      saving: true
    })

    try {
      await updateListing(deal.id, listing.id)
    } catch (e) {
      console.log(e)
    }

    this.setState({
      saving: false
    })
  }

  render() {
    const { deal } = this.props
    const { saving, showMlsModal } = this.state

    return (
      <div className="deal-mls">
        {saving && (
          <div className="loading">
            <i className="fa fa-spin fa-spinner" />
          </div>
        )}

        {!saving && (
          <ListingInfo
            deal={deal}
            editMls={() => this.toggleSearchModal()}
            deleteMls={() => this.requestDeleteMls()}
          />
        )}

        <SearchModal
          show={showMlsModal}
          onHide={() => this.toggleSearchModal()}
          onSelectListing={listing => this.onSelectListing(listing)}
        />
      </div>
    )
  }
}

export default connect(null, { updateListing, confirmation })(MlsListing)

import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import LinkButton from 'components/Button/LinkButton'
import SearchListingDrawer from 'components/SearchListingDrawer'
import Spinner from 'components/Spinner'
import DeleteIcon from 'components/SvgIcons/Delete/IconDelete'

import { updateListing } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { getField } from 'models/Deal/helpers/context'

import { Loading, MlsNumber, EditMls } from './styled'

class MlsConnect extends React.Component {
  state = {
    isDrawerOpen: false,
    isSaving: false
  }

  buttonStyle = {
    padding: 0
  }

  toggleDrawer = () =>
    this.setState(state => ({
      isDrawerOpen: !state.isDrawerOpen
    }))

  handleSelectListing = async listings => {
    const { deal } = this.props

    this.setState({
      isDrawerOpen: false,
      isSaving: true
    })

    const listingId = Array.isArray(listings) ? listings[0].id : null

    try {
      await this.props.updateListing(deal.id, listingId)
    } catch (e) {
      console.log(e)
    }

    this.setState({
      isSaving: false
    })
  }

  removeMlsConnection = () => {
    this.props.confirmation({
      message: 'Remove MLS Listing?',
      description: 'Removing the MLS# will remove the property from your deal.',
      confirmLabel: 'Yes, I am sure',
      onConfirm: () => this.handleSelectListing({ id: null })
    })
  }

  render() {
    const { deal } = this.props

    if (this.state.isSaving) {
      return (
        <Loading>
          <Spinner />
        </Loading>
      )
    }

    return (
      <Fragment>
        {deal.listing ? (
          <MlsNumber>
            MLS# {getField(deal, 'mls_number')}
            <EditMls onClick={this.toggleDrawer}>Edit</EditMls>
            <DeleteIcon onClick={this.removeMlsConnection} />
          </MlsNumber>
        ) : (
          <LinkButton style={this.buttonStyle} onClick={this.toggleDrawer}>
            Add MLS# number
          </LinkButton>
        )}

        <SearchListingDrawer
          title="Connect Deal to MLS"
          isOpen={this.state.isDrawerOpen}
          onClose={this.toggleDrawer}
          onSelectListings={this.handleSelectListing}
        />
      </Fragment>
    )
  }
}

export default connect(
  null,
  { updateListing, confirmation }
)(MlsConnect)

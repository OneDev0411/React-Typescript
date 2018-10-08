import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import LinkButton from 'components/Button/LinkButton'
import SearchListingDrawer from 'components/SearchListingDrawer'
import Spinner from 'components/Spinner'

import { updateListing } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { Loading, MlsNumber } from './styled'

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

  handleSelectListing = async listing => {
    const { deal } = this.props

    this.setState({
      isDrawerOpen: false,
      isSaving: true
    })

    try {
      await this.props.updateListing(deal.id, listing.id)
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
          <MlsNumber>MLS# {deal.mls_context.mls_number}</MlsNumber>
        ) : (
          <LinkButton style={this.buttonStyle} onClick={this.toggleDrawer}>
            Add MLS# number
          </LinkButton>
        )}

        <SearchListingDrawer
          isOpen={this.state.isDrawerOpen}
          onClose={this.toggleDrawer}
          onSelectListing={this.handleSelectListing}
        />
      </Fragment>
    )
  }
}

export default connect(
  null,
  { updateListing, confirmation }
)(MlsConnect)

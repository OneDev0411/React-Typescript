import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import CreateOfferModal from './modal'
import hasPrimaryOffer from '../../utils/has-primary-offer'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  toggleDisplayModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  render() {
    const { deal } = this.props
    return (
      <div className="create-offer">
        <Button
          className="add-offer-button"
          onClick={() => this.toggleDisplayModal()}
        >
          Add New Offer
        </Button>

        <CreateOfferModal
          deal={deal}
          hasPrimaryOffer={hasPrimaryOffer(deal)}
          show={this.state.showModal}
          onClose={() => this.toggleDisplayModal()}
        />

      </div>
    )
  }
}

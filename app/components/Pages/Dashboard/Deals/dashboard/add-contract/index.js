import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import AddContractModal from './modal'
import hasPrimaryContract from '../../utils/has-primary-contract'

class AddContract extends React.Component {
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
      <div>
        <Button
          className="info-btn add-contract-button"
          onClick={() => this.toggleDisplayModal()}
        >
          Add a new contract
        </Button>

        <AddContractModal
          deal={deal}
          hasPrimaryContract={hasPrimaryContract(deal)}
          show={this.state.showModal}
          onClose={() => this.toggleDisplayModal()}
        />

      </div>
    )
  }
}

export default AddContract

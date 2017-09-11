import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import AddContractModal from './modal'

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
    return (
      <div>
        <Button
          className="add-contract-button"
          onClick={() => this.toggleDisplayModal()}
        >
          Add a new contract
        </Button>

        <AddContractModal
          deal={this.props.deal}
          show={this.state.showModal}
          onClose={() => this.toggleDisplayModal()}
        />

      </div>
    )
  }
}

export default AddContract

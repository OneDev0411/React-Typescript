import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'

class CreateDealModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      street_number: '',
      street_address: '',
      unit_number: '',
      city: '',
      state: '',
      zipcode: ''
    }
  }

  render() {
    const { show, saving } = this.props

    const {
      street_number,
      street_address,
      unit_number,
      city,
      state,
      zipcode
    } = this.state

    return (
      <Modal
        show={show}
        backdrop="static"
        dialogClassName="modal-deal-listing"
        onHide={() => this.props.onHide()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter the full listing address</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="place-create">
            <div className="row_one">
              <FormControl
                placeholder="Street #"
                className="street_number"
                value={street_number}
                onChange={e => this.setState({ street_number: e.target.value })}
              />
              <FormControl
                placeholder="Street address"
                className="street_address"
                value={street_address}
                onChange={e => this.setState({ street_address: e.target.value })}
              />
              <FormControl
                placeholder="Apartment/Unit number"
                className="unit_number"
                value={unit_number}
                onChange={e => this.setState({ unit_number: e.target.value })}
              />
            </div>
            <div className="row_two">
              <FormControl
                placeholder="City"
                className="city"
                value={city}
                onChange={e => this.setState({ city: e.target.value })}
              />
              <FormControl
                placeholder="State"
                className="state"
                value={state}
                onChange={e => this.setState({ state: e.target.value })}
              />
              <FormControl
                placeholder="Zipcode"
                className="zipcode"
                value={zipcode}
                onChange={e => this.setState({ zipcode: e.target.value })}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <Button
                bsStyle="primary"
                style={{ margin: '20px' }}
                onClick={() => this.props.onClickSave(this.state)}
                disabled={saving}
              >
                { saving ? 'Creating...' : 'Create Deal' }
              </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    )
  }
}

export default CreateDealModal

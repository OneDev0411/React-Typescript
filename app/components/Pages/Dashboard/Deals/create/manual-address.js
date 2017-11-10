import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      street_number: '',
      street_name: '',
      unit_number: '',
      city: '',
      state: '',
      postal_code: ''
    }
  }

  onAdd() {
    this.props.onCreateAddress({
      type: 'listing',
      address_components: this.state
    })
  }

  isValidated() {
    const {
      street_number,
      street_name,
      unit_number,
      city,
      state,
      postal_code
    } = this.state

    return [street_number, street_name, unit_number, city, state, postal_code]
      .join('')
      .length > 0
  }

  render() {
    const { show, saving } = this.props

    const {
      street_number,
      street_name,
      unit_number,
      city,
      state,
      postal_code
    } = this.state

    return (
      <Modal
        show={show}
        backdrop="static"
        dialogClassName="modal-deal-listing"
        onHide={() => this.props.onHide()}
      >
        <Modal.Header closeButton>
          Address
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
                className="street_name"
                value={street_name}
                onChange={e => this.setState({ street_name: e.target.value })}
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
                value={postal_code}
                onChange={e => this.setState({ postal_code: e.target.value })}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <Button
                bsStyle="primary"
                style={{ margin: '20px' }}
                onClick={() => this.onAdd()}
                disabled={saving || !this.isValidated()}
              >
                Add
              </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    )
  }
}

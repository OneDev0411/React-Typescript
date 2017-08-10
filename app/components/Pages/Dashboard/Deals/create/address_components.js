import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'
import { parseLocation } from 'parse-address'

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

  componentWillReceiveProps(nextProps) {
    const { show, saving, address, item } = nextProps

    if (!show || saving) {
      return false
    }

    let { address_components } = item

    if (!address_components) {
      address_components = this.parseAddress(address)
    }

    this.setState({
      street_number: address_components.street_number || '',
      street_address: address_components.street_name || '',
      unit_number: address_components.unit_number || '',
      city: address_components.city || '',
      state: address_components.state_code || '',
      zipcode: address_components.postal_code || ''
    })
  }

  parseAddress(address) {
    const parsed = parseLocation(address)

    if (!parsed) {
      return address
    }

    const parts = {}

    if (parsed.number) {
      parts.street_number = parsed.number
    }

    if (parsed.prefix) {
      parts.street_dir_prefix = parsed.prefix
    }

    if (parsed.street) {
      parts.street_name = parsed.street
    }

    if (parsed.type) {
      parts.street_suffix = parsed.type
    }

    if (parsed.city) {
      parts.city = parsed.city
    }

    if (parsed.zip) {
      parts.postal_code = parsed.zip
    }

    if (parsed.state) {
      parts.state_code = parsed.state
    }

    if (parsed.sec_unit_num) {
      parts.unit_number = parsed.sec_unit_num
    }

    return parts
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
        dialogClassName="modal-deal-listing"
        onHide={() => this.props.onHide()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Is this the full listing address?</Modal.Title>
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
                { saving ? 'Creating...' : 'Yes, add' }
              </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    )
  }
}

export default CreateDealModal

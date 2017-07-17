import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Modal, Button, FormControl } from 'react-bootstrap'
import { parseLocation } from 'parse-address'
import { createDeal } from '../../../../../store_actions/deals'

class CreateDealModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      saving: false,
      street_number: '',
      street_address: '',
      unit_number: '',
      city: '',
      state: '',
      zipcode: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address === this.props.address)
      return
  }

  showCreateModal() {
    const { address } = this.props
    const { item, side } = this.props
    let { address_components } = item

    if (item.isListing) {
      const data = {
        context: {
          deal_type: side
        },
        listing: item.id
      }
      return this.saveDeal(data)
    }

    if (!address_components)
      address_components = this.parseAddress(address)

    this.setState({
      show: true,
      street_number: address_components.street_number || '',
      street_address: address_components.street_name || '',
      unit_number: address_components.unit_number || '',
      city: address_components.city || '',
      state: address_components.state_code || '',
      zipcode: address_components.postal_code || ''
    })
  }

  onClickSave() {
    const { side } = this.props
    const { street_number, street_address, unit_number, city, state, zipcode } = this.state

    // create full address
    let full_address = [
      street_number,
      street_address,
      city,
      state,
      zipcode
    ].join(' ')

    const data = {
      context: {
        deal_type: side,
        full_address,
        street_number,
        street_address,
        unit_number,
        city,
        state,
        zipcode
      }
    }

    this.saveDeal(data)
  }

  async saveDeal(data) {
    const { createDeal } = this.props

    // show loading
    this.setState({ saving: true })

    // create deal
    const deal = await createDeal(data)

    // hide loading
    this.setState({ saving: false })

    // navigate to the deal
    // browserHistory.push(`/dashboard/deals/${deal.id}`)
  }

  parseAddress(address) {
    const parsed = parseLocation(address)

    if (!parsed)
      return address

    const parts = {}

    if (parsed.number)
      parts.street_number = parsed.number

    if (parsed.prefix)
      parts.street_dir_prefix = parsed.prefix

    if (parsed.street)
      parts.street_name = parsed.street

    if (parsed.type)
      parts.street_suffix = parsed.type

    if (parsed.city)
      parts.city = parsed.city

    if (parsed.zip)
      parts.postal_code = parsed.zip

    if (parsed.state)
      parts.state_code = parsed.state

    if (parsed.sec_unit_num)
      parts.unit_number = parsed.sec_unit_num

    return parts
  }

  render() {
    const { street_number, street_address, unit_number, city, state, zipcode, saving } = this.state

    return (
      <div style={{ display: 'inline' }}>

        <Button
          bsStyle="primary"
          onClick={() => this.showCreateModal()}
          disabled={saving}
        >
          { saving ? 'Creating...' : 'Create' }
        </Button>

        <Modal
          show={this.state.show}
          dialogClassName="modal-deal-listing"
          onHide={() => this.setState({ show: false })}
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
                  onClick={() => this.onClickSave()}
                  disabled={saving}
                >
                  { saving ? 'Creating...' : 'Yes, create' }
                </Button>
              </div>
            </div>
          </Modal.Body>

        </Modal>
      </div>
    )
  }
}

export default connect(null, { createDeal })(CreateDealModal)

import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'
import Deal from '../../../../../models/Deal'
import cn from 'classnames'

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      street_number: this.getAddressField('street_number'),
      street_name: this.getAddressField('street_name'),
      unit_number: this.getAddressField('unit_number'),
      city: this.getAddressField('city'),
      state: this.getAddressField('state'),
      postal_code: this.getAddressField('postal_code')
    }
  }

  getAddressField(field) {
    const { deal } = this.props

    if (!deal) {
      return ''
    }

    if (deal.listing) {
      return deal.mls_context[field] || ''
    }

    return Deal.get.field(deal, field) || ''
  }

  onAdd() {
    this.props.onCreateAddress({
      type: 'listing',
      address_components: this.state
    })

    this.clearStates()
  }
  clearStates = () =>
    this.setState({
      street_number: '',
      street_name: '',
      unit_number: '',
      city: '',
      state: '',
      postal_code: ''
    })
  isValidated() {
    const { street_name, city, state, postal_code } = this.state

    return (
      street_name.trim().length > 0 &&
      city.trim().length > 0 &&
      state.trim().length > 0 &&
      /(^\d{4,}$)/.test(postal_code)
    )
  }

  render() {
    const { show, deal, saving } = this.props
    const {
      street_number,
      street_name,
      unit_number,
      city,
      state,
      postal_code
    } = this.state
    const zipCodeValid = !postal_code || /(^\d{4,}$)/.test(postal_code)

    return (
      <Modal
        show={show}
        backdrop="static"
        dialogClassName="modal-deal-listing"
        onHide={() => {
          this.clearStates()
          this.props.onHide()
        }}
      >
        <Modal.Header closeButton>Address</Modal.Header>

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
                placeholder="Street Name *"
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
                placeholder="City *"
                className="city"
                value={city}
                onChange={e => this.setState({ city: e.target.value })}
              />
              <FormControl
                placeholder="State *"
                className="state"
                value={state}
                onChange={e => this.setState({ state: e.target.value })}
              />
              <FormControl
                placeholder="Zipcode *"
                className={cn('zipcode', { error: !zipCodeValid })}
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
                {deal ? 'Update Address' : 'Add'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

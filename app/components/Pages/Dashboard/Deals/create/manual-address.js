import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.getPopulatedForm(props.deal)
    this.postalCodePattern = /(^\d{4,}$)/
  }

  componentWillReceiveProps(nextProps) {
    const { show, deal } = nextProps
    const { isFormPopulated } = this.state

    if (show && !isFormPopulated) {
      this.setState(this.getPopulatedForm(deal))
    }
  }

  getPopulatedForm(deal) {
    return {
      isFormPopulated: true,
      street_number: this.getAddressField(deal, 'street_number'),
      street_name: this.getAddressField(deal, 'street_name'),
      unit_number: this.getAddressField(deal, 'unit_number'),
      city: this.getAddressField(deal, 'city'),
      state: this.getAddressField(deal, 'state'),
      postal_code: this.getAddressField(deal, 'postal_code')
    }
  }

  getAddressField(deal, field) {
    if (!deal) {
      return ''
    }

    if (deal.listing) {
      return deal.mls_context[field] || ''
    }

    return Deal.get.field(deal, field) || ''
  }

  getAddressComponent() {
    const {
      street_number,
      street_name,
      city,
      state,
      unit_number,
      postal_code
    } = this.state

    const full_address = [
      street_number || '',
      street_name || '',
      unit_number ? `, Unit ${unit_number},` : '',
      city ? `, ${city}` : '',
      state ? `, ${state}` : '',
      postal_code ? `, ${postal_code}` : ''
    ]
      .join(' ')
      .trim()
      .replace(/(\s)+,/gi, ',')
      .replace(/,,/gi, ',')

    return {
      street_number,
      street_name,
      unit_number,
      city,
      state,
      postal_code,
      full_address
    }
  }

  onAdd() {
    this.props.onCreateAddress({
      type: 'listing',
      address_components: this.getAddressComponent()
    })

    this.clearStates()
  }

  clearStates() {
    this.setState({
      isFormPopulated: false,
      street_number: '',
      street_name: '',
      unit_number: '',
      city: '',
      state: '',
      postal_code: ''
    })
  }

  isValidated() {
    const { street_name, city, state, postal_code } = this.state

    return (
      street_name.trim().length > 0 &&
      city.trim().length > 0 &&
      state.trim().length > 0 &&
      this.postalCodePattern.test(postal_code)
    )
  }

  areValuesChanged() {
    const {
      street_number,
      street_name,
      unit_number,
      city,
      state,
      postal_code
    } = this.state

    return (
      street_number !== this.getAddressField('street_number') ||
      street_name !== this.getAddressField('street_name') ||
      unit_number !== this.getAddressField('unit_number') ||
      city !== this.getAddressField('city') ||
      state !== this.getAddressField('state') ||
      postal_code !== this.getAddressField('postal_code')
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

    const isPostalCodeValid =
      !postal_code || this.postalCodePattern.test(postal_code)

    const valuesChanged = this.areValuesChanged()

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
                className={cn('zipcode', { error: !isPostalCodeValid })}
                value={postal_code}
                onChange={e => this.setState({ postal_code: e.target.value })}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <Button
                bsStyle="primary"
                style={{ margin: '20px' }}
                onClick={() => this.onAdd()}
                disabled={saving || !this.isValidated() || !valuesChanged}
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

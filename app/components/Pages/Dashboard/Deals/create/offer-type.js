import React from 'react'
import RadioButton from '../components/radio'
import hasPrimaryOffer from '../utils/has-primary-offer'

export default ({
  deal,
  offerType,
  onChangeOfferType
}) => {
  const hpo = hasPrimaryOffer(deal)

  return (
    <div className="form-section deal-offer">
      <div className="hero">
        Is this a primary or backup offer? <span className="required">*</span>
      </div>

      <RadioButton
        selected={offerType === 'primary'}
        tooltip={hpo ? 'You can not have 2 primary offers at the same time' : null}
        disabled={hpo === true}
        title="Primary Offer"
        onClick={() => !hpo && onChangeOfferType('primary')}
      />

      <RadioButton
        selected={offerType === 'backup'}
        title="Backup Offer"
        onClick={() => onChangeOfferType('backup')}
      />
    </div>
  )
}

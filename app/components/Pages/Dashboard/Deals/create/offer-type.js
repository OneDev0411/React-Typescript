import React from 'react'
import RadioButton from '../../../../../views/components/radio'
import { H2 } from 'components/Typography/headings'

export default ({ dealHasPrimaryOffer, offerType, onChangeOfferType }) => (
  <div className="form-section deal-offer">
    <H2 className="hero">
      Is this a primary or backup offer? <span className="required">*</span>
    </H2>

    <RadioButton
      selected={offerType === 'primary'}
      tooltip={
        dealHasPrimaryOffer ? 'This deal already has a primary offer' : null
      }
      disabled={dealHasPrimaryOffer === true}
      title="Primary Offer"
      onClick={() => !dealHasPrimaryOffer && onChangeOfferType('primary')}
    />

    {/* <RadioButton
      selected={offerType === 'backup'}
      title="Backup Offer"
      onClick={() => onChangeOfferType('backup')}
    /> */}
  </div>
)

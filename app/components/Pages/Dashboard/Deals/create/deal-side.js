import React from 'react'
import RadioButton from '../../../../../views/components/radio'
import { H2 } from 'components/Typography/headings'

const BUYING = 'Buying'
const SELLING = 'Selling'

export default ({ selectedSide, onChangeDealSide }) => (
  <div className="form-section deal-side">
    <H2 className="hero">
      Which side are you on? <span className="required">*</span>
    </H2>

    <div className="deal-radio-row">
      <RadioButton
        selected={selectedSide === BUYING}
        title="Buyer (or Tenant)"
        onClick={() => onChangeDealSide(BUYING)}
      />
    </div>

    <div className="deal-radio-row">
      <RadioButton
        selected={selectedSide === SELLING}
        title="Seller (or Landlord)"
        onClick={() => onChangeDealSide(SELLING)}
      />
    </div>
  </div>
)

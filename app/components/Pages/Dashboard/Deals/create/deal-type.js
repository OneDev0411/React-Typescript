import React from 'react'

import RadioButton from '../../../../../views/components/CheckmarkButton'
import { H2 } from 'components/Typography/headings'

export default ({ isDraft, isRequired, onChangeDealType }) => (
  <div className="form-section">
    <H2 className="hero">
      What is the stage of this deal?&nbsp;
      {isRequired && <span className="required">*</span>}
    </H2>

    <div className="deal-radio-row">
      <RadioButton
        selected={isDraft === true}
        title="Draft (This deal is in an early stage & paperwork has just started)"
        onClick={() => onChangeDealType(true)}
      />
    </div>

    <div className="deal-radio-row">
      <RadioButton
        selected={isDraft === false}
        title="Visible to admin (This deal is ready and I want to start submitting paperwork)"
        onClick={() => onChangeDealType(false)}
      />
    </div>
  </div>
)

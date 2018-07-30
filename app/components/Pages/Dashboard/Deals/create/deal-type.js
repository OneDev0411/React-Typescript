import React from 'react'

import RadioButton from '../../../../../views/components/radio'

export default ({ isNewDeal, isDraft, isRequired, onChangeDealType }) => (
  <div className="form-section">
    <div className="hero">
      What is the stage of this deal?&nbsp;
      {isRequired && <span className="required">*</span>}
    </div>

    <RadioButton
      selected={isDraft === true}
      title={`${
        isNewDeal ? 'Start as' : 'Update'
      } draft (This deal is in an early stage & paperwork has just started)`}
      onClick={() => onChangeDealType(true)}
    />

    <RadioButton
      selected={isDraft === false}
      title="Live deal (This deal is ready and I want to start submitting paperwork)"
      onClick={() => onChangeDealType(false)}
    />
  </div>
)

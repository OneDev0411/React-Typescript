import React from 'react'

import RadioButton from '../../../../../views/components/radio'

export default ({ isDraft, isRequired, onChangeDealType }) => (
  <div className="form-section">
    <div className="hero">
      What is the stage of this deal?&nbsp;
      {isRequired && <span className="required">*</span>}
    </div>

    <RadioButton
      selected={isDraft === true}
      title="Start as Draft (it's too early, just starting some paperwork)"
      onClick={() => onChangeDealType(true)}
    />

    <RadioButton
      selected={isDraft === false}
      title="Live deal (we are in businuess and I want to start submitting paperwork)"
      onClick={() => onChangeDealType(false)}
    />
  </div>
)

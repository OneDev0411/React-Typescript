import React from 'react'

import RadioButton from '../../../../../views/components/radio'

export default ({ dealType, isRequired, onChangeDealType }) => (
  <div className="form-section">
    <div className="hero">
      What is the stage of this deal?&nbsp;
      {isRequired && <span className="required">*</span>}
    </div>

    <RadioButton
      selected={dealType === 'draft'}
      title="Start as Draft (it's too early, just starting some paperwork)"
      onClick={() => onChangeDealType('draft')}
    />

    <RadioButton
      selected={dealType === 'live'}
      title="Live deal (we are in businuess and I want to start submitting paperwork)"
      onClick={() => onChangeDealType('live')}
    />
  </div>
)

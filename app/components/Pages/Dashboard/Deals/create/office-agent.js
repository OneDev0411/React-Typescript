import React from 'react'
import RadioButton from '../components/radio'

export default ({
  isOfficeAgent,
  onChangeOfficeAgent
}) => (
  <div className="form-section office-agent">
    <div className="hero">
      Is the listing agent from your office? <span className="required">*</span>
    </div>

    <RadioButton
      selected={isOfficeAgent === true}
      title="Yes"
      onClick={() => onChangeOfficeAgent(true)}
    />

    <RadioButton
      selected={isOfficeAgent === false}
      title="No"
      onClick={() => onChangeOfficeAgent(false)}
    />
  </div>
)


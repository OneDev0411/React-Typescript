import React from 'react'
import RadioButton from '../../../../../views/components/RadioButton'
import { H2 } from 'components/Typography/headings'

export default ({ isOfficeAgent, onChangeOfficeAgent }) => (
  <div className="form-section office-agent">
    <H2 className="hero">
      Is the listing agent from your office? <span className="required">*</span>
    </H2>

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

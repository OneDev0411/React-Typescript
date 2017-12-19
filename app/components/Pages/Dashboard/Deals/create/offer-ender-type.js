import React from 'react'
import RadioButton from '../components/radio'

export default ({
  enderType,
  onChangeEnderType
}) => (
  <div className="form-section deal-offer">
    <div className="hero">
      Is this a double-ender deal? <span className="required">*</span>
    </div>

    <RadioButton
      selected={enderType === null}
      title="No"
      onClick={() => onChangeEnderType(null)}
    />

    <RadioButton
      selected={enderType === 'AgentDoubleEnder'}
      title="Yes, I am on both sides"
      onClick={() => onChangeEnderType('AgentDoubleEnder')}
    />

    <RadioButton
      selected={enderType === 'OfficeDoubleEnder'}
      title="Yes, another agent from my office is on the other side of this deal"
      onClick={() => onChangeEnderType('OfficeDoubleEnder')}
    />
  </div>
)

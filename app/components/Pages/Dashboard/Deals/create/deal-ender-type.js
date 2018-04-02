import React from 'react'
import RadioButton from '../components/radio'

export default ({
  enderType,
  isRequired,
  showAgentDoubleEnder,
  onChangeEnderType
}) => (
  <div className="form-section deal-offer">
    <div className="hero">
      Is this an in-house deal?&nbsp;
      {isRequired && <span className="required">*</span>}
    </div>

    <RadioButton
      selected={enderType === null}
      title="No"
      onClick={() => onChangeEnderType(null)}
    />

    {showAgentDoubleEnder && (
      <RadioButton
        selected={enderType === 'AgentDoubleEnder'}
        title="Yes, I represent both sides"
        onClick={() => onChangeEnderType('AgentDoubleEnder')}
      />
    )}

    <RadioButton
      selected={enderType === 'OfficeDoubleEnder'}
      title="Yes, another agent from my office is on the other side of this deal"
      onClick={() => onChangeEnderType('OfficeDoubleEnder')}
    />
  </div>
)

import React from 'react'
import cn from 'classnames'
import RadioButton from '../../../../../views/components/radio'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'
import { H2 } from 'components/Typography/headings'

export default ({
  enderType,
  isRequired,
  hasError,
  showAgentDoubleEnder,
  onChangeEnderType
}) => (
  <div className="form-section deal-offer">
    <H2 className={cn('hero', { hasError })}>
      Is this an in-house deal?&nbsp;
      {isRequired && <span className="required">*</span>}
      {hasError && <RequiredIcon />}
    </H2>

    <div className="deal-radio-row">
      <RadioButton
        selected={enderType === null}
        title="No"
        onClick={() => onChangeEnderType(null)}
      />
    </div>

    {showAgentDoubleEnder && (
      <div className="deal-radio-row">
        <RadioButton
          selected={enderType === 'AgentDoubleEnder'}
          title="Yes, I represent both sides"
          onClick={() => onChangeEnderType('AgentDoubleEnder')}
        />
      </div>
    )}

    <div className="deal-radio-row">
      <RadioButton
        selected={enderType === 'OfficeDoubleEnder'}
        title="Yes, another agent from my office is on the other side of this deal"
        onClick={() => onChangeEnderType('OfficeDoubleEnder')}
      />
    </div>
  </div>
)

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grey } from 'views/utils/colors'

MetaData.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

const Item = styled.span`
  font-size: 0.875rem;
  font-weight: 500;

  > span {
    font-weight: 400;
    color: ${grey.A550};
  }
`

export function MetaData({ steps }) {
  const totalSteps = steps.length
  const automatedSteps = steps.filter(s => s.is_automated).length
  const due_in = steps.reduce((acc, cur) => acc.due_in + cur.due_in)
  const automationPercent = automatedSteps > 0 ? totalSteps / automatedSteps : 0

  return (
    <div style={{ display: 'inline-block', marginBottom: '1em' }}>
      <Item>
        {totalSteps}&nbsp;<span>steps</span>&nbsp;&nbsp;.&nbsp;&nbsp;
      </Item>
      <Item>
        {due_in / (24 * 3600)}&nbsp;<span>days</span>&nbsp;&nbsp;.&nbsp;&nbsp;
      </Item>
      <Item>
        {automationPercent}%&nbsp;<span>automation</span>
      </Item>
    </div>
  )
}

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
  const days = 3
  const automation = 23

  return (
    <div style={{ display: 'inline-block', marginBottom: '1em' }}>
      <Item>
        {steps.length}&nbsp;<span>steps</span>&nbsp;&nbsp;.&nbsp;&nbsp;
      </Item>
      <Item>
        {days}&nbsp;<span>days</span>&nbsp;&nbsp;.&nbsp;&nbsp;
      </Item>
      <Item>
        {automation}%&nbsp;<span>automation</span>
      </Item>
    </div>
  )
}

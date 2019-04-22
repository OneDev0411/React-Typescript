import React from 'react'
import Flex from 'styled-flex-component'
import styled, { css } from 'styled-components'

import ToolTip from '../tooltip'
import IconSelectedRadio from '../SvgIcons/Radio/SelectedRadio/IconSelectedRadio'
import IconUnSelectedRadio from '../SvgIcons/Radio/UnSelectedRadio/IconUnSelectedRadio'

const LabelContainer = styled.div`
  margin-left: 0.5rem;
`
const RadioLabel = styled.div`
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `};
`
const Caption = styled.div`
  color: #7f7f7f;
  font-size: 1rem;
`

export default ({
  selected,
  title,
  tooltip = null,
  disabled = false,
  onClick = () => {},
  style = {},
  caption = ''
}) => (
  <Flex justifyStart style={style} onClick={onClick}>
    <ToolTip caption={tooltip}>
      <Flex alignStart style={{ cursor: 'pointer' }}>
        {selected ? <IconSelectedRadio /> : <IconUnSelectedRadio />}
        <LabelContainer>
          <RadioLabel disabled={disabled}>{title}</RadioLabel>

          {caption && <Caption>{caption}</Caption>}
        </LabelContainer>
      </Flex>
    </ToolTip>
  </Flex>
)

import React from 'react'
import ToolTip from '../tooltip'
import styled, { css } from 'styled-components'
import IconSelectedRadio from '../SvgIcons/Radio/SelectedRadio/IconSelectedRadio'
import IconUnSelectedRadio from '../SvgIcons/Radio/UnSelectedRadio/IconUnSelectedRadio'
import Flex from 'styled-flex-component'

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
  font-size: 0.875rem;
`

export default ({
  selected,
  title,
  tooltip = null,
  disabled = false,
  onClick = () => null,
  style = {},
  caption = ''
}) => (
  <Flex justifyStart style={style} onClick={onClick}>
    <ToolTip caption={tooltip}>
      <Flex alignStart>
        {selected ? <IconSelectedRadio /> : <IconUnSelectedRadio />}
        <LabelContainer>
          <RadioLabel disabled={disabled}>{title}</RadioLabel>

          <Caption>{caption}</Caption>
        </LabelContainer>
      </Flex>
    </ToolTip>
  </Flex>
)

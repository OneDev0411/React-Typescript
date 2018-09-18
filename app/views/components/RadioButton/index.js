import React from 'react'
import ToolTip from '../tooltip'
import styled, { css } from 'styled-components'
import IconSelectedRadio from '../SvgIcons/Radio/SelectedRadio/IconSelectedRadio'
import IconUnSelectedRadio from '../SvgIcons/Radio/UnSelectedRadio/IconUnSelectedRadio'
import Flex from 'styled-flex-component'

const RadioLabel = styled.span`
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `};
`
export default ({
  selected,
  title,
  tooltip = null,
  disabled = false,
  onClick = () => null,
  style = {}
}) => (
  <Flex justifyStart style={style} onClick={onClick}>
    <ToolTip caption={tooltip}>
      <Flex alignCenter>
        {selected ? <IconSelectedRadio /> : <IconUnSelectedRadio />}
        <RadioLabel disabled={disabled}>{title}</RadioLabel>
      </Flex>
    </ToolTip>
  </Flex>
)

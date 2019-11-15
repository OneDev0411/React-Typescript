import styled from 'styled-components'

import ArrowDropDown from '../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import ActionButton from '../Button/ActionButton'

export const Icon = styled(ArrowDropDown)<{ isOpen?: boolean }>`
  fill: #000;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

export const Button = styled(ActionButton)<{ fullWidth?: boolean }>`
  position: relative;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: ${props => (props.fullWidth ? 'space-between' : 'initial')};
  font-weight: normal;
`

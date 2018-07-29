import ShadowButton from '../Button/ShadowButton'
import ArrowDown from '../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const Button = ShadowButton.extend`
  position: relative;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: ${props => (props.fullWidth ? 'space-between' : 'initial')};
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:focus {
    outline: none;
  }
`

export const Icon = ArrowDown.extend`
  width: 2em;
  height: 2em;
  fill: #8da2b5;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'initial')};
`

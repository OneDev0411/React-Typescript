import ShadowButton from '../Button/ShadowButton'
import ArrowDown from '../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const Button = ShadowButton.extend`
  position: relative;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: ${props => (props.fullWidth ? 'space-between' : 'initial')};
  font-weight: normal;

  &:focus {
    outline-width: 2px;
  }
`

export const Icon = ArrowDown.extend`
  position: absolute;
  top: 50%;
  right: 0.5em;
  width: 2em;
  height: 2em;
  fill: #8da2b5;
  transform: ${({ isOpen }) =>
    isOpen ? 'translateY(-50%) rotateX(180deg)' : 'translateY(-50%)'};
`

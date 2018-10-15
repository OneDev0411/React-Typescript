import styled from 'styled-components'
import Flex from 'styled-flex-component'

import LinkButton from '../../components/Button/LinkButton'
import ArrowDropDown from '../../components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { grey, primary, borderColor } from '../../utils/colors'

export const FormContainer = styled.form`
  width: 100%;
  padding: 1.5em 0 6rem;
`
export const FieldContainer = Flex.extend`
  height: 2.5rem;
  border-radius: 3px;
  background-color: ${grey.A150};
`

export const DropButton = LinkButton.extend`
  font-weight: 500;
  justify-content: space-between;
  background-color: ${grey.A150};
  color: ${({ isOpen }) => (isOpen ? primary : '#000')};

  :hover {
    > svg {
      fill: ${primary};
    }
  }
`

export const IconDrop = ArrowDropDown.extend`
  position: relative;
  margin-left: 1em;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

export const Footer = Flex.extend`
  position: absolute;
  bottom: 0;
  left: 1.5rem;
  right: 0;
  width: calc(100% - 3rem);
  height: 4.5rem;
  background-color: #fff;
  border-top: 1px solid ${borderColor};
`

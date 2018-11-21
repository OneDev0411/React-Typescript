import styled from 'styled-components'
import Flex from 'styled-flex-component'

import LinkButton from '../../../../components/Button/LinkButton'
import ArrowDropDown from '../../../../components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { grey, primary } from '../../../../utils/colors'

export const FormContainer = styled.form`
  width: 100%;
  padding: 1.5em;

  /* &:hover {
    cursor: pointer;
  } */
`
export const FieldContainer = styled(Flex)`
  height: 40px;
  border-radius: 3px;
  background-color: ${grey.A150};
`

export const DropButton = styled(LinkButton)`
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

export const IconDrop = styled(ArrowDropDown)`
  position: relative;
  margin-left: 1em;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

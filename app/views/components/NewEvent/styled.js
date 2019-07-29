import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey, primary } from 'views/utils/colors'
import LinkButton from 'components/Button/LinkButton'
import ArrowDropDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const FormContainer = styled.form`
  width: 100%;
  padding: 1.5em;
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

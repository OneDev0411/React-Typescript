import styled from 'styled-components'

import { StyledSVGWithProps } from 'utils/ts-utils'
import LinkButton from 'components/Button/LinkButton'
import ArrowDropDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { grey, primary } from 'views/utils/colors'

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

interface IconDropProps {
  isOpen?: boolean
}

export const IconDrop: StyledSVGWithProps<IconDropProps> = styled(
  ArrowDropDown
)<IconDropProps>`
  position: relative;
  margin-left: 1em;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

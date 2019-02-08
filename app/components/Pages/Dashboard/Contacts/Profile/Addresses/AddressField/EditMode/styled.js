import styled from 'styled-components'

import LinkButton from 'components/Button/LinkButton'
import ArrowIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { primary, grey, borderColor } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
  margin: 0 1em 1em;
  padding: 0.5em;
  background: ${grey.A150};
  border-radius: 3px 3px 0 0;
  border: 1px dashed ${primary};
`

export const DropdownButton = styled(LinkButton)`
  padding: 0;
  height: auto;
  line-height: 1.5;
  color: ${({ isOpen }) => (isOpen ? primary : grey.A900)};

  > svg {
    fill: ${grey.A900};
  }
`

export const DropdownArrowIcon = styled(ArrowIcon)`
  position: relative;
  margin-left: 1em;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

export const Input = styled.input`
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;

  &:focus {
    outline: none;
  }
`

export const ActionBar = styled.div`
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  width: 100%;
  height: 3em;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5em;
  background: ${grey.A100};
  border-radius: 0 0 3px 3px;
  border: 1px solid ${borderColor};
`

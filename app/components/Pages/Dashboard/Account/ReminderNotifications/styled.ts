import styled, { css } from 'styled-components'

import { StyledSVGWithProps } from 'utils/ts-utils'

import LinkButton from 'components/Button/LinkButton'
import ArrowDropDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { grey, primary } from 'views/utils/colors'

interface DropButtonProps {
  isOpen?: boolean
  disabled?: boolean
}

export const DropButton = styled(LinkButton)<DropButtonProps>`
  font-weight: 500;
  justify-content: space-between;
  background-color: ${grey.A150};
  color: ${({ isOpen }) => (isOpen ? primary : '#000')};

  ${({ disabled }) =>
    !disabled &&
    css`
      :hover {
        > svg {
          fill: ${primary};
        }
      }
    `}
`

interface IconDropProps {
  isOpen?: boolean
}

export const IconDrop: StyledSVGWithProps<IconDropProps> = styled(
  ArrowDropDown
)`
  position: relative;
  margin-left: 1em;
  transform: ${({ isOpen }: IconDropProps) =>
    isOpen ? 'rotateX(180deg)' : 'none'};
`

export const Container = styled.div`
  margin-bottom: 2rem;
`

export const CheckBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 0.5rem;
  width: fit-content;
  cursor: pointer;

  &:last-child {
    margin-left: 0.2rem;
  }
`

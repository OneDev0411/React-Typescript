import styled, { css } from 'styled-components'

import LinkButton from 'components/Button/LinkButton'
import StarIcon from 'components/SvgIcons/Star/StarIcon'
import ArrowIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { primary, grey, borderColor } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
  margin: 0 1em 1em;
  padding: 0.5em;
  background: ${grey.A150};
  border: 1px dashed ${primary};
  border-radius: ${props => (props.isStatic ? '3px' : '3px 3px 0 0')};
`

export const Label = styled.div`
  display: flex;
  align-items: center;
  color: ${grey.A900};
  margin-bottom: 0.25em;
`

export const Star = styled(StarIcon)`
  width: 1rem;
  height: 1rem;
  fill: #f5a623;
`

export const Value = styled.div`
  min-height: 1.5rem;
`

export const DropdownButton = styled(LinkButton)`
  padding: 0;
  height: auto;
  line-height: 1.5;
  margin-bottom: 0.5em;
  color: ${({ isOpen }) => (isOpen ? primary : grey.A900)};

  > svg {
    fill: ${({ isOpen }) => (isOpen ? primary : grey.A900)};
  }
`

export const DropdownArrowIcon = styled(ArrowIcon)`
  position: relative;
  margin-left: 1em;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

export const Input = styled.input`
  width: 100%;
  padding: 0.25em 0.5em;
  border: none;
  background: transparent;
  background: #fff;

  &:focus {
    outline: none;
    border-radius: 3px;
    border: 1px solid ${primary};
  }
`

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${props =>
    props.isStatic
      ? css`
          margin-top: 1rem;
        `
      : css`
          position: absolute;
          top: calc(100% + 1px);
          left: 0;
          height: 3em;
          width: 100%;
          z-index: 1;
          padding: 0 0.5em;
          border-radius: 0 0 3px 3px;
          background: ${grey.A100};
          border: 1px solid ${borderColor};
        `}
`

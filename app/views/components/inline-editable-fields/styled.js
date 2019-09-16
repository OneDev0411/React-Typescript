import styled, { css } from 'styled-components'
import { fade } from '@material-ui/core/styles'

import LinkButton from 'components/Button/LinkButton'
import ActionButton from 'components/Button/ActionButton'
import StarIcon from 'components/SvgIcons/Star/StarIcon'
import ArrowIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { primary, grey, borderColor } from 'views/utils/colors'

export const ViewModeContainer = styled.div`
  position: relative;
  padding: 0.5em;
  border-radius: ${props => props.theme.shape.borderRadius}px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.palette.action.hover};

    .action-bar {
      visibility: visible;
    }
  }
`

export const ViewModeActionBar = styled.div`
  position: absolute;
  top: 90%;
  padding-top: 0.5em;
  right: 0;
  visibility: hidden;
  display: flex;
  z-index: 1;

  & svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
`

export const EditButton = styled(ActionButton)`
  padding: 0;
  height: auto;
  line-height: 1;
`

export const EditModeContainer = styled.div`
  position: relative;
  padding: 0.5em;
  border-radius: ${props =>
    props.isStatic
      ? `${props.theme.shape.borderRadius}px`
      : `${props.theme.shape.borderRadius}px ${
          props.theme.shape.borderRadius
        }px 0 0`};
  background: ${props =>
    props.hasError
      ? fade(
          props.theme.palette.error.main,
          props.theme.palette.action.hoverOpacity
        )
      : props.theme.palette.action.selected};
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
  word-break: break-word;
`

export const DropdownButton = styled(LinkButton)`
  padding: 0;
  height: auto;
  line-height: 1.5;
  margin-bottom: 0.5em;
  color: ${({ isOpen }) => (isOpen ? primary : '#000')};

  > svg {
    fill: ${({ isOpen }) => (isOpen ? primary : '#000')};
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

export const EditModeActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.showDelete ? 'space-between' : 'flex-end'};
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

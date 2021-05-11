import styled, { css, ThemedStyledProps } from 'styled-components'
import { Theme, fade } from '@material-ui/core'

import LinkButton from 'components/Button/LinkButton'
import ActionButton from 'components/Button/ActionButton'
import StarIcon from 'components/SvgIcons/Star/StarIcon'
import ArrowIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import type { Props as EditModeProps } from './InlineEditableField/EditMode'

export const ViewModeContainer = styled.div<{
  theme: Theme
}>`
  position: relative;
  padding: 0.5em;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.palette.action.hover};

    .action-bar {
      visibility: visible;
    }
  }
`

export const ViewModeActionBar = styled.div`
  position: absolute;
  top: 90%;
  right: 0;
  visibility: hidden;
  display: flex;
  z-index: 1;
`

export const EditButton = styled(ActionButton as any)`
  padding: 0;
  height: auto;
  line-height: 1;
`

export const EditModeContainer = styled.div<
  ThemedStyledProps<Pick<EditModeProps, 'isStatic' | 'hasError'>, Theme>
>`
  position: relative;
  padding: 0.5em;
  border-radius: ${({ isStatic, theme }) =>
    isStatic
      ? `${theme.shape.borderRadius}px`
      : `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`};
  background: ${({ hasError, theme }) =>
    hasError
      ? fade(theme.palette.error.main, theme.palette.action.hoverOpacity)
      : theme.palette.action.hover};
`

export const Label = styled.div<{
  theme: Theme
}>`
  display: flex;
  align-items: center;
  margin-bottom: 0.25em;
  font-family: ${({ theme }) => theme.typography.subtitle2.fontFamily};
  font-size: ${({ theme }) => theme.typography.subtitle2.fontSize};
  font-weight: ${({ theme }) => theme.typography.subtitle2.fontWeight};
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
  color: ${({ isOpen, theme }) =>
    isOpen ? theme.palette.primary.main : theme.palette.common.black};

  > svg {
    fill: ${({ isOpen, theme }) =>
      isOpen ? theme.palette.primary.main : theme.palette.common.black};
  }
`

export const DropdownArrowIcon = styled(ArrowIcon)`
  position: relative;
  margin-left: 1em;
  transform: ${({ isOpen }: any) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

export const Input = styled.input`
  width: 100%;
  padding: 0.25em 0.5em;
  border: none;
  background: transparent;
  background: ${({ theme }) => theme.palette.common.white};
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
  }
`

export const EditModeActionBar = styled.div<
  ThemedStyledProps<Pick<EditModeProps, 'showDelete' | 'isStatic'>, Theme>
>`
  display: flex;
  align-items: center;
  justify-content: ${({ showDelete }) =>
    showDelete ? 'space-between' : 'flex-end'};
  ${({ isStatic, theme }) =>
    isStatic
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
          background: ${theme.palette.grey[100]};
          border: 1px solid ${theme.palette.grey[300]};
        `}
`

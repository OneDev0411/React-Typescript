import styled, { ThemedStyledProps } from 'styled-components'
import { Theme } from '@material-ui/core'

import IconCheck from '../SvgIcons/Checkmark/IconCheckmark'

// visually hidden
export const Input = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`

export const Label = styled.label`
  display: inline-flex;
  align-items: center;
  margin: 0;
  font-weight: normal;
  cursor: pointer;
`

interface CheckMarkBoxProps {
  size: number
  checked?: boolean
}

export const CheckMarkBox = styled.div<CheckMarkBoxProps>`
  width: ${({ size }) => size / 16}rem;
  height: ${({ size }) => size / 16}rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background-color: ${({
    checked,
    theme
  }: ThemedStyledProps<CheckMarkBoxProps, Theme>) =>
    checked ? theme.palette.secondary.main : theme.palette.common.white};
  border: solid 1px
    ${({ checked, theme }: ThemedStyledProps<CheckMarkBoxProps, Theme>) =>
      checked ? theme.palette.secondary.main : theme.palette.common.black};

  &:hover {
    background-color: ${({
      checked,
      theme
    }: ThemedStyledProps<CheckMarkBoxProps, Theme>) =>
      checked ? theme.palette.secondary.main : theme.palette.grey[100]};
  }
`

export const CheckMark = styled(IconCheck)`
  width: 100%;
  height: 100%;
  fill: #fff;
`

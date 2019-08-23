import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const ButtonGroup = styled.div`
  display: flex;
  background: #fff;
`

export const Button = styled.button`
  border: 1px dashed
    ${(props: ThemeProps<Theme>) => props.theme.palette.divider};
  width: 50%;
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(3, 0)};
  color: ${(props: ThemeProps<Theme>) => props.theme.palette.primary.main};
  font-weight: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.fontWeightMedium};
  outline: none;
  background: transparent;

  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-right: none;
  }

  &:last-child {
    border-left: 1px solid
      ${(props: ThemeProps<Theme>) => props.theme.palette.divider};
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`

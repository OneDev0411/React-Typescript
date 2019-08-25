import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const StepIndex = styled.div`
  position: absolute;
  top: 2rem;
  left: -3rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  color: ${(props: ThemeProps<Theme>) => props.theme.palette.text.secondary};
  border: 1px solid ${(props: ThemeProps<Theme>) => props.theme.palette.divider};
  display: flex;
  justify-content: center;
  align-items: center;
`

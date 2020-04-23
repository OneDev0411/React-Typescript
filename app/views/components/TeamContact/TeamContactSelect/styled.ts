import styled from 'styled-components'
import { Theme } from '@material-ui/core'

export const ButtonText = styled.div`
  margin: ${({ theme }: { theme: Theme }) => theme.spacing(0, 1, 0, 2)};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: calc(100% - 51px);
  text-align: left;
  font-size: ${({ theme }: { theme: Theme }) =>
    theme.typography.button.fontSize};
  font-weight: ${({ theme }: { theme: Theme }) =>
    theme.typography.button.fontWeight};
`

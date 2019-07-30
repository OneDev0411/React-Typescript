import styled from 'styled-components'
import { Theme } from '@material-ui/core'

export const Assignee = styled.span`
  font-weight: 500;
  color: ${({ theme }: { theme: Theme }) => theme.palette.primary.main};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`

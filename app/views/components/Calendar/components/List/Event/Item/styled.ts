import styled from 'styled-components'
import { Theme } from '@material-ui/core'

export const Title = styled.div`
  font-weight: 500;

  a {
    color: ${({ theme }: { theme: Theme }) => theme.palette.primary.main};
  }
`

export const SubTitle = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.25px;

  color: #6a7589;
`

import styled from 'styled-components'
import { Link } from '@material-ui/core'

export const Container = styled.div`
  padding: 0 1.5em;
`
export const NavigateDuplicate = styled(Link)`
  color: ${props => props.theme.palette.info.dark};
  &:hover {
    color: ${props => props.theme.palette.info.dark};
  }
`

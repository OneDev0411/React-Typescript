import styled from 'styled-components'
import { Link } from 'react-router'

export const FileName = styled.div`
  font-size: 1rem;
  font-weight: 500;

  a {
    color: #000;
  }
`

export const FileLink = styled(Link)`
  :hover {
    color: ${({ theme }) => theme.palette.secondary.main};
  }
`

export const FileDate = styled.div`
  color: #999;
  font-size: 0.875rem;
`

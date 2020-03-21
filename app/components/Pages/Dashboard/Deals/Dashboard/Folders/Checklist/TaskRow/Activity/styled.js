import styled from 'styled-components'

export const LastActivity = styled.div`
  color: ${({ theme }) => theme.palette.grey['900']} !important;
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d1d1;
  opacity: 0;

  :hover {
    color: ${({ theme }) => theme.palette.secondary.main} !important;
    text-decoration: underline;
    cursor: pointer;
  }
`

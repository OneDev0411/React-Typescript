import styled from 'styled-components'

export const ListItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #f2f2f2;
  font-size: 1rem;

  :hover {
    cursor: pointer;
    text-decoration: underline;
    color: ${({ theme }) => theme.palette.secondary.main};
  }
`

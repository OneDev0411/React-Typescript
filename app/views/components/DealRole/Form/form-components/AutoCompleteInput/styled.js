import styled from 'styled-components'

export const ItemTitle = styled.div`
  font-size: 1rem;
`

export const ItemDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => (props.isActive ? '#f1f1f1' : 'gray')};
`

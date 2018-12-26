import styled from 'styled-components'

export const Container = styled.div``

export const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  box-shadow: 0 1px 0 0 #f5f5f5;

  ${props =>
    props.spaceBetween &&
    `
    justify-content: space-between;
  `};
`

export const NameSection = styled.div`
  margin: 0 1rem;
  cursor: pointer;
`

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
`

export const DateTime = styled.div`
  font-size: 0.875rem;
  color: #7f7f7f;
`

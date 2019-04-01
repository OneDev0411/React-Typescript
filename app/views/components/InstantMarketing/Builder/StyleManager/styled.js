import styled from 'styled-components'

export const Container = styled.div`
  padding: 0 1rem;
  font-family: Barlow;
  > div:not(:empty) {
    margin-bottom: 2rem;
  }
`

export const ItemTitle = styled.p`
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  color: #000;
`

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

import styled from 'styled-components'

export const Container = styled.div`
  padding: 0;
  font-family: Barlow;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  > div:not(:empty) {
    margin-bottom: 1rem;
    padding: 0 0.5rem;
    flex-grow: 1;
    flex-basis: 0;
  }
`

export const ItemTitle = styled.p`
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  color: #000;
  padding-top: 0.5rem;
`

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

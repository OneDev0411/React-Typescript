import styled from 'styled-components'

export const Container = styled.div`
  overflow-y: hidden;
  overflow-x: scroll;
`

export const LoadingDealContainer = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 18px;
  font-weight: 500;

  button {
    margin-top: 1rem;
  }
`

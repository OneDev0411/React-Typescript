import styled from 'styled-components'

export const BaseContainer = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export const LoadingDealContainer = styled(BaseContainer)`
  font-size: 1.2rem;
  font-weight: 500;

  .sk-circle {
    margin: 0 auto 20px auto !important;
  }
`

export const ErrorContainer = styled(BaseContainer)`
  font-size: 1.1rem;
  text-align: center;
  margin: 0 10%;

  button {
    margin-top: 1rem;
  }
`

export const Container = styled.div`
  background-color: #f5f5f5;
`

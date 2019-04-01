import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #eee;
  padding: 0.5rem;

  button {
    margin-left: 0.5rem;
  }
`

export const Title = styled.div`
  font-size: 1rem;
  color: #000;
  font-weight: 500;
`

export const TitleContainer = styled.div`
  text-align: left;
`

export const WhoSignedContainer = styled.div``

export const WhoSignedHeader = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid #f5f5f5;
  font-size: 1.1rem;
  font-weight: 500;
`

export const WhoSignedRow = styled.div`
  display: flex;
  padding: 0.5rem;
`

export const RoleName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-left: 0.5rem;
`

export const SignDate = styled.div`
  font-size: 0.875rem;
  color: #000;
  margin-left: 0.5rem;
`

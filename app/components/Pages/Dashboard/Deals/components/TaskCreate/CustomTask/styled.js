import styled from 'styled-components'

export const Label = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin: 0.5rem 0;
`

export const Note = styled.div`
  color: #9b9b9b;
  margin-top: 0.5rem;
  font-size: 1rem;
`

export const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.palette.secondary.main};
  height: 3rem;
  padding: 0 1rem;
`

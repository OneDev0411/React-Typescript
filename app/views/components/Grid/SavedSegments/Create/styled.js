import styled from 'styled-components'

export const Container = styled.div`
  display: inline-flex;
  vertical-align: middle;
  padding: 1rem 0;
`

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 1rem 0 2rem;

  :not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.palette.grey['100']};
  }
`

export const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
`

export const ItemTitle = styled.div`
  font-weight: 400;
  color: #000;
`

export const TextInput = styled.input`
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${props => props.theme.palette.grey['300']};
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;

  :focus {
    outline: none;
    border-color: ${props => props.theme.palette.primary.main};
  }
`

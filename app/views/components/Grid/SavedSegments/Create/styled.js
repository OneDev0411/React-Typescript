import styled from 'styled-components'

export const Container = styled.div`
  display: inline-flex;
  vertical-align: middle;
  padding: ${props => props.theme.spacing(2, 2)};
`

export const ItemRow = styled.div`
  display: flex;
  align-items: start;
  gap: ${props => props.theme.spacing(2)}px;
  cursor: pointer;
  padding: ${props => props.theme.spacing(2, 1)};
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
  background-color: #ffffff;
  border-radius: ${props => props.theme.shape.borderRadius};
  border: solid 1px ${props => props.theme.palette.grey['300']};
  padding: ${props => props.theme.spacing(1, 1.5)};
  margin: ${props => props.theme.spacing(0.75, 0, 0)};

  :focus {
    outline: none;
    border-color: ${props => props.theme.palette.primary.main};
  }
`

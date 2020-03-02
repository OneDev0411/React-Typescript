import styled from 'styled-components'

export const Container = styled.div`
  display: inline-flex;
  margin-left: ${props => props.theme.spacing(1)}px;
  vertical-align: middle;
`

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5em;
  cursor: pointer;
`

export const ItemTitle = styled.span`
  font-weight: 400;
  color: #000;
`

export const TextInput = styled.input`
  width: 300px;
  height: 2.5rem;
  margin-left: 1em;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${props => props.theme.palette.grey['300']};
  padding: 0 1em;

  :focus {
    outline: none;
    border-color: ${props => props.theme.palette.primary.main};
  }
`

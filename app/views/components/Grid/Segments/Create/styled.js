import styled from 'styled-components'
import ActionButton from '../../../Button/ActionButton'

export const Container = styled.div``

export const SaveButton = ActionButton.extend`
  border: solid 1px #2196f3;
  margin-left: ${props => props.padLeft || 0}px;

  &:hover {
    background-color: #fff;
    color: #2196f3;
  }
`

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 12px;
  cursor: pointer;
`

export const ItemTitle = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: #17283a;
  margin-left: 16px;
`

export const TextInput = styled.input`
  width: 300px;
  height: 35px;
  margin-left: 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #2196f3;
  padding: 0 15px;
`

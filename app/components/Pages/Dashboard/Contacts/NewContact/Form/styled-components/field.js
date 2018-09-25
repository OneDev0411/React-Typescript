import styled from 'styled-components'
import {
  placeholderColor,
  borderColor,
  error
} from '../../../../../../../views/utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75em 1em;
  border-bottom: 1px solid ${borderColor};
`

export const Title = styled.label`
  font-weight: normal;
  cursor: pointer;

  &::after {
    content: '${props => (props.required ? '*' : '')}';
    display: inline-block;
    margin-left: 0.5em;
    font-weight: bold;
    color: ${error};
  }
`

export const ErrorMessage = styled.div`
  color: ${error};
  margin-top: 0.5em;
`

export const Input = styled.input`
  width: 100%;
  font-size: 1.125rem;
  padding: 0;
  border: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${placeholderColor};
  }
`

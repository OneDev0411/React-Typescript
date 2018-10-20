import styled from 'styled-components'

import {
  borderColor,
  error,
  grey
} from '../../../../../../../../../views/utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${borderColor};
  justify-content: ${props => (props.withoutLabel ? 'flex-end' : 'initial')};
`

export const Title = styled.label`
  font-size: 1rem;
  font-weight: normal;
  cursor: pointer;
  color: ${grey.A900};

  &::after {
    content: '${props => (props.required ? '*' : '')}';
    display: inline-block;
    margin-left: 0.5rem;
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
  padding: 0;
  border-width: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

import styled from 'styled-components'

import { borderColor, error, grey } from '../../utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.5em;
  border-bottom: 1px solid ${borderColor};
  justify-content: ${props => (props.withoutLabel ? 'flex-end' : 'initial')};
`

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: normal;
  cursor: pointer;
  color: ${grey.A900};
  > span {
    display: inline-block;
  }

  &::after {
    content: '${props => (props.required ? '*' : '')}';
    display: inline-block;
    margin-left: 0.5em;
    font-weight: bold;
    color: ${error};
  }
`

export const LabelNote = styled.span`
  font-size: small;
  margin-left: 0.5rem;
  color: ${grey.A600};
`

export const ErrorMessage = styled.div`
  color: ${error};
  margin-top: 0.5em;
`

export const Input = styled.input`
  width: 100%;
  padding: 0;
  font-size: 1.125rem;
  border: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

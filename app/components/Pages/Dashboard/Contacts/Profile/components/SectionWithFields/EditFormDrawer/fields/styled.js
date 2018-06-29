import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75em 1em;
  border-bottom: 1px solid #dde5ec;
  justify-content: ${props => (props.withoutLabel ? 'flex-end' : 'initial')};
`

export const Title = styled.label`
  font-weight: normal;
  cursor: pointer;
  color: #485c6b;

  &::after {
    content: '${props => (props.required ? '*' : '')}';
    display: inline-block;
    margin-left: 0.5em;
    font-weight: bold;
    color: #f00;
  }
`

export const ErrorMessage = styled.div`
  color: #f00;
  margin-top: 0.5em;
`

export const Input = styled.input`
  width: 100%;
  padding: 0;
  font-size: 1.8rem;
  border-width: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #cad4db;
  }
`

import styled from 'styled-components'

export const InputField = styled.input`
  border: none;
  font-size: 16px;
  width: 100%;
  border-radius: 4px;

  ::placeholder {
    color: #cad4db;
    opacity: 1;
  }

  :focus {
    outline: none;
  }

  background: ${props => (props.hasError ? '#fff5f4' : 'transparent')};
`

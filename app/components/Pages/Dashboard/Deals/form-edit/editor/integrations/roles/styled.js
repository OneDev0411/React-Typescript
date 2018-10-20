import styled from 'styled-components'

export const Input = styled.input`
  padding: 0 5px;
  border-radius: 3px;
  border: solid 1px #d4d4d4;
  background-color: #f9f9f9;

  :focus {
    outline: none;
    border-color: #003bdf;
    background-color: #ffffff;
  }
`

export const Divider = styled.div`
  border-bottom: 1px solid #d4d4d4;
  margin: 1rem 0;
`

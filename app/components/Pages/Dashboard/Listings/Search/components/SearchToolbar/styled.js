import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  align-items: center;
  width: 28em;
  height: 3em;
  padding-right: 0.75em;
  border-radius: 3px;
  background-color: #f7f7f7;
  border: solid 1px #d4d4d4;
`

export const Input = styled.input`
  width: 100%;
  height: 100%;
  padding: 0.5em;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  // remove clear icon on IE and Edge browser
  &::-ms-clear {
    display: none;
  }
`

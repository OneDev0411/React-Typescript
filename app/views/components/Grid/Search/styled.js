import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 4px;
  background-color: #fefefe;
  border: solid 1px #d4d4d4;
`

export const TextInput = styled.input`
  width: 100%;
  height: 45px;
  border: none;
  font-size: 16px;
  padding: 0 5px;
  font-family: Barlow, sans-serif;

  ::-webkit-input-placeholder {
    font-size: 16px;
    font-weight: 500;
    color: #000;
    opacity: 0.5;
    font-family: Barlow, sans-serif;
  }

  :focus {
    outline: none;
  }
`

export const Icon = styled.div`
  color: #7f7f7f;
  padding-top: ${props => (props.isSearching ? '0' : '9px')};
`

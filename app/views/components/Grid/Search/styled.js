import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 4px;
  background-color: #fefefe;
  border: solid 1px #dce5eb;
`

export const TextInput = styled.input`
  width: 100%;
  height: 45px;
  border: none;
  font-size: 16px;
  padding: 0 5px;

  ::-webkit-input-placeholder {
    font-size: 15px;
    font-weight: 500;
    color: #8da2b5;
  }

  :focus {
    outline: none;
  }
`

export const Icon = styled.div`
  color: #8da2b5;
  padding-top: ${props => (props.isSearching ? '0' : '9px')};
`

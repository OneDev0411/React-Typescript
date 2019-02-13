import styled from 'styled-components'

import { grey, primary } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 1.5rem;
`

export const Description = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  color: #4a4a4a;
`

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${grey.A300};
`

export const RowTitle = styled.h6`
  color: ${grey.A900};
  font-size: 1rem;
  line-height: 1.5rem;
`

export const CreateTagInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;
  border-radius: 4px;
  background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : '#f9f9f9')};
  border: solid 1px ${({ isFocused }) => (isFocused ? primary : '#d4d4d4')};
  :hover {
    background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : grey.A100)};
  }
`

export const CreateTagInput = styled.input`
  width: 100%;
  height: 3rem;
  border: 1px solid ${grey.A300};
  border-radius: 3px;
  font-size: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: ${grey.A175};
  caret-color: ${primary};

  ::-ms-clear {
    display: none;
  }

  ::-webkit-input-placeholder {
    font-size: 1rem;
    color: #9b9b9b;
  }

  ::placeholder {
    font-size: 1rem;
    color: #9b9b9b;
  }

  :focus {
    outline: none;
    border-color: ${primary};
    background-color: #ffffff;
  }
`

import styled from 'styled-components'

import IconButtonFlex from 'components/Button/IconButton'

export const Container = styled.div`
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  background-color: ${({ isFocused, theme }) =>
    isFocused ? theme.palette.common.white : '#f9f9f9'};
  border: solid 1px
    ${({ isFocused, theme }) =>
      isFocused ? theme.palette.primary.main : theme.palette.divider};
  :hover {
    background-color: ${({ isFocused, theme }) =>
      isFocused ? theme.palette.common.white : theme.palette.grey[100]};
  }
`

export const TextInput = styled.input`
  width: 100%;
  height: 2.8125rem;
  border: none;
  font-size: 1rem;
  padding: 0 0.3125rem;
  background-color: transparent;
  caret-color: ${({ theme }) => theme.palette.primary.main};

  ::-ms-clear {
    display: none;
  }

  ::-webkit-input-placeholder {
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.grey[600]};
    font-family: LatoRegular, sans-serif;
  }

  ::placeholder {
    font-size: 1rem;
    font-weight: normal;
    color: ${({ theme }) => theme.palette.grey[600]};
    font-family: LatoRegular, sans-serif;
  }

  :focus {
    outline: none;
  }
`

export const Icon = styled.div`
  color: ${({ theme }) => theme.palette.grey[600]};
  padding-top: 0.25rem;
`

export const IconButton = styled(IconButtonFlex)`
  display: block;
`

import styled from 'styled-components'

import IconSearchBase from 'components/SvgIcons/Search/IconSearch'
import IconButtonFlex from 'components/Button/IconButton'

import { theme } from '../../../../theme'

export const Container = styled.div`
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  background-color: ${({ isFocused }) =>
    isFocused ? theme.palette.common.white : '#f9f9f9'};
  border: solid 1px
    ${({ isFocused }) =>
      isFocused ? theme.palette.primary.main : theme.palette.divider};
  :hover {
    background-color: ${({ isFocused }) =>
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
  caret-color: ${theme.palette.primary.main};

  ::-ms-clear {
    display: none;
  }

  ::-webkit-input-placeholder {
    font-size: 1rem;
    font-weight: 400;
    color: ${theme.palette.grey[600]};
    font-family: LatoRegular, sans-serif;
  }

  ::placeholder {
    font-size: 1rem;
    font-weight: normal;
    color: ${theme.palette.grey[600]};
    font-family: LatoRegular, sans-serif;
  }

  :focus {
    outline: none;
  }
`

export const IconSearch = styled(IconSearchBase)`
  path {
    fill: ${theme.palette.grey[600]} !important;
  }
  ${Container}:hover & path {
    fill: #000000 !important;
  }
`

export const Icon = styled.div`
  color: ${theme.palette.grey[600]};
  padding-top: 0.25rem;
`

export const IconButton = styled(IconButtonFlex)`
  display: block;
`

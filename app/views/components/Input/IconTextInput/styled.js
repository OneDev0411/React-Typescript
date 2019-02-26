import styled from 'styled-components'

import { primary, grey } from 'views/utils/colors'
import IconSearchBase from 'components/SvgIcons/Search/IconSearch'
import IconButtonFlex from 'components/Button/IconButton'

export const Container = styled.div`
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : '#f9f9f9')};
  border: solid 1px ${({ isFocused }) => (isFocused ? primary : '#d4d4d4')};
  :hover {
    background-color: ${({ isFocused }) => (isFocused ? '#ffffff' : grey.A100)};
  }
`

export const TextInput = styled.input`
  width: 100%;
  height: 2.8125rem;
  border: none;
  font-size: 1rem;
  padding: 0 0.3125rem;
  background-color: transparent;
  caret-color: ${primary};

  ::-ms-clear {
    display: none;
  }

  ::-webkit-input-placeholder {
    font-size: 1rem;
    font-weight: 500;
    color: ${grey.A900};
    font-family: Barlow, sans-serif;
  }

  ::placeholder {
    font-size: 1rem;
    font-weight: normal;
    color: ${grey.A900};
    font-family: Barlow, sans-serif;
  }

  :focus {
    outline: none;
  }
`

export const IconSearch = styled(IconSearchBase)`
  path {
    fill: ${grey.A900} !important;
  }
  ${Container}:hover & path {
    fill: #000000 !important;
  }
`

export const Icon = styled.div`
  color: ${grey.A900};
  padding-top: 0.25rem;
`

export const IconButton = styled(IconButtonFlex)`
  display: block;
`

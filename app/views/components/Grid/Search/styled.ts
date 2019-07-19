import styled from 'styled-components'

import { primary, grey, borderColor } from '../../../utils/colors'
import IconSearchBase from '../../SvgIcons/Search/IconSearch'
import IconButtonFlex from '../../Button/IconButton'

export const Container = styled.div<{ isFocused: boolean }>`
  display: flex;
  align-items: center;
  padding-left: 1em;
  border-radius: 3px;
  background-color: ${({ isFocused }) => (isFocused ? '#fff' : grey.A175)};
  border: solid 1px ${({ isFocused }) => (isFocused ? primary : borderColor)};
  :hover {
    background-color: ${({ isFocused }) => (isFocused ? '#fff' : grey.A100)};
  }
`

export const TextInput = styled.input`
  width: 100%;
  height: 45px;
  border: none;
  font-size: 1rem;
  padding: 0 5px;
  font-family: Barlow, sans-serif;
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
    font-weight: 500;
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
    fill: #000 !important;
  }
`
export const Icon = styled.div<{ isSearching?: boolean }>`
  color: ${grey.A900};
  padding-top: ${props => (props.isSearching ? '0' : '4px')};
`

export const IconButton = styled(IconButtonFlex)`
  display: block;
`

import styled from 'styled-components'
import { primary, grey } from '../../../utils/colors'
import IconSearchBase from '../../SvgIcons/Search/IconSearch'

export const Container = styled.div`
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

export const TextInput = styled.input`
  width: 100%;
  height: 45px;
  border: none;
  font-size: 16px;
  padding: 0 5px;
  font-family: Barlow, sans-serif;
  background-color: transparent;
  caret-color: ${primary};

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

  ${Container}:hover & {
    ::placeholder {
      color: #000000;
    }
  }
`

export const IconSearch = IconSearchBase.extend`
  path {
    fill: ${grey.A900} !important;
  }
  ${Container}:hover & path {
    fill: #000000 !important;
  }
`
export const Icon = styled.div`
  color: ${grey.A900};
  padding-top: ${props => (props.isSearching ? '0' : '9px')};
`

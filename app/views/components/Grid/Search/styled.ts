import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

import IconSearchBase from '../../SvgIcons/Search/IconSearch'
import IconButtonFlex from '../../Button/IconButton'

interface StyleProp extends ThemeProps<Theme> {
  isFocused?: boolean
  isSearching?: boolean
}

export const Container = styled.div<StyleProp>`
  display: flex;
  align-items: center;
  padding-left: 1em;
  border-radius: 3px;
  background-color: ${({ isFocused, theme }) =>
    isFocused ? '#fff' : theme.palette.grey[50]};
  border: solid 1px
    ${({ isFocused, theme }) =>
      isFocused ? theme.palette.primary.main : theme.palette.grey[300]};
  :hover {
    background-color: ${({ isFocused, theme }) =>
      isFocused ? '#fff' : theme.palette.grey[100]};
  }
`

export const TextInput = styled.input<StyleProp>`
  width: 100%;
  height: 45px;
  border: none;
  font-size: 1rem;
  padding: 0 5px;
  font-family: LatoRegular, sans-serif;
  background-color: transparent;
  caret-color: ${({ theme }) => theme.palette.primary.main};

  ::-ms-clear {
    display: none;
  }

  ::-webkit-input-placeholder {
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }: ThemeProps<Theme>) => theme.palette.grey[600]};
    font-family: LatoRegular, sans-serif;
  }

  ::placeholder {
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }: ThemeProps<Theme>) => theme.palette.grey[600]};
    font-family: LatoRegular, sans-serif;
  }
  :focus {
    outline: none;
  }
`

export const IconSearch = styled(IconSearchBase)`
  path {
    fill: ${({ theme }: ThemeProps<Theme>) =>
      theme.palette.grey[600]} !important;
  }
  ${Container}:hover & path {
    fill: #000 !important;
  }
`
export const Icon = styled.div<StyleProp>`
  color: ${({ theme }) => theme.palette.grey[600]};
  padding-top: ${({ isSearching }) => (isSearching ? '0' : '4px')};
`

export const IconButton = styled(IconButtonFlex)`
  display: block;
`

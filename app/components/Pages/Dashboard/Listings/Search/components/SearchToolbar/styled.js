import styled from 'styled-components'

import { primary, grey } from '../../../../../../../views/utils/colors'
import IconButton from '../../../../../../../views/components/Button/IconButton'
import IconSearch from '../../../../../../../views/components/SvgIcons/Search/IconSearch'

export const Form = styled.form`
  position: relative;
`

export const Input = styled.input`
  width: 28em;
  height: 3em;
  padding: 0.5em 2.75em 0.5em 2.5em;
  border-radius: 3px;
  background-color: ${grey.A125};
  border: solid 1px ${grey.A400};

  &:focus {
    outline: none;
    border: 1px solid ${primary};
    background-color: #fff;
  }

  &:disabled {
    color: ${grey.A550};
    cursor: not-allowed;
  }

  // remove clear icon on IE and Edge browser
  &::-ms-clear {
    display: none;
  }
`
export const SearchIcon = IconSearch.extend`
  position: absolute;
  top: 1em;
  left: 1em;
  fill: ${grey.A900};
`

export const ClearButton = IconButton.extend`
  position: absolute;
  top: 0.75em;
  right: 0.75em;
`

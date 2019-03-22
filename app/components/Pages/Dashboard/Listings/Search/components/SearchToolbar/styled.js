import styled from 'styled-components'

import {
  primary,
  grey,
  borderColor
} from '../../../../../../../views/utils/colors'
import Card from '../../../../../../../views/components/Card'
import IconButton from '../../../../../../../views/components/Button/IconButton'
import IconSearch from '../../../../../../../views/components/SvgIcons/Search/IconSearch'

export const Input = styled.input`
  width: 28em;
  height: 3em;
  padding: 0.5em 2.75em 0.5em 2.5em;
  border-radius: 3px;
  background-color: ${props => (props.value ? '#fff' : grey.A125)};
  border: solid 1px ${props => (props.value ? primary : grey.A400)};

  &:focus {
    outline: none;
    border: 1px solid ${primary};
    background-color: #fff;
  }

  &:disabled {
    color: ${grey.A550};
  }

  // remove clear icon on IE and Edge browser
  &::-ms-clear {
    display: none;
  }
`
export const SearchIcon = styled(IconSearch)`
  position: absolute;
  top: 1em;
  left: 1em;
  fill: ${grey.A900};
`

export const ClearButton = styled(IconButton)`
  position: absolute;
  top: 0.75em;
  right: 0.75em;
`
export const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    width: 100%;
    height: 100%;
  }
`

export const ListContainer = styled(Card)`
  width: 126%;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 2;
`

export const ListTitle = styled.div`
  color: ${grey.A900};
  padding: 0.5rem 0.75rem;
  font-weight: 500;
`

export const Item = styled.div`
  cursor: default;
  padding: 0 0.75rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 2rem;
  border-bottom: 1px solid ${borderColor};
  font-size: 0.75rem;
  color: ${grey.A900};

  &:hover {
    background: ${grey.A100};
  }

  .item__query {
    font-size: 0.875rem;
    padding-right: 0.25rem;
    color: #000;

    .item__matched {
      font-weight: 600;
    }
  }
`

import styled from 'styled-components'

import { blue, grey } from '../../../../../../../../views/utils/colors'

export const DropdownItem = styled.a`
  color: #000;
  display: block;
  padding: 0.5em 1em;
  white-space: nowrap;

  &:hover,
  &:focus {
    color: #fff;
    text-decoration: none;
    background-color: ${blue.A100};
  }
`
export const DropdownItemSub = styled.span`
  display: inline-block;
  margin-left: 0.5em;
  color: ${grey.A600};
`

import styled from 'styled-components'

import { borderColor } from 'views/utils/colors'

export const MenuContainer = styled.div`
  padding: 1em;
  position: relative;
  height: 100%;
  &:focus {
    outline: none !important;
  }
`

export const FilterContainer = styled.div`
  margin: 0 1.5em 0.5em 1.5em;
  padding-bottom: 1.5em;
  border-bottom: 1px solid ${borderColor};
`

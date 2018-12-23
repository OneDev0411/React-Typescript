import styled from 'styled-components'

export const MenuContainer = styled.div`
  padding: 0 1em;
  position: relative;
  height: 100%;
  &:focus {
    outline: none !important;
  }
`

export const TableContainer = styled.div`
  height: calc(100% - 7.0625rem);
  position: relative;
  overflow: auto;
`

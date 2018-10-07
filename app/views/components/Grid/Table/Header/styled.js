import styled from 'styled-components'
import { Row, Cell } from '../styled'

export const Header = styled.div`
  font-weight: 600;
  margin-bottom: 24px;
`

export const HeaderRow = Row.extend`
  min-height: auto;
  padding: 0.5em;
  border: none;
`

export const HeaderCell = Cell.extend`
  display: flex;
  align-self: center;
  align-items: center;
`

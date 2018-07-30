import styled from 'styled-components'
import { Row, Cell } from '../styled'

export const Header = styled.div``

export const HeaderRow = Row.extend`
  margin-bottom: 32px;
`

export const HeaderCell = Cell.extend`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  padding: 0 4px;

  ${props =>
    props.isSortable &&
    `
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }
  `};
`

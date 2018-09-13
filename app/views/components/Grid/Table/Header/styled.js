import styled from 'styled-components'
import { Row, Cell } from '../styled'

export const Header = styled.div`
  font-weight: 600;
  margin-bottom: 24px;
`

export const HeaderRow = Row.extend``

export const HeaderCell = Cell.extend`
  align-self: center;

  ${props =>
    props.isSortable &&
    `
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }
  `};
`

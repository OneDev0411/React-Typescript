import styled from 'styled-components'

import { Row, Cell } from '../styled'

export const Header = styled.div`
  ${stickyStyle}
  font-weight: 600;
  margin-bottom: 24px;
`

export const HeaderRow = styled(Row)`
  min-height: auto;
  padding: 0.5em;
  border: none;
  :hover {
    background-color: transparent;
  }
`

export const HeaderCell = styled(Cell)`
  display: flex;
  align-self: center;
  align-items: center;
`

function stickyStyle(props) {
  if (props.isHeaderSticky) {
    return 'position: sticky; background: #fff;top: 0;'
  }

  return ''
}

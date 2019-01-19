import styled from 'styled-components'

import { H4 } from 'components/Typography/headings'
import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 11rem;
`

/* folder */
export const FolderContainer = styled.div`
  border-radius: 3px;
  background-color: #fff;
  border: solid 1px #d4d4d4;
  margin-bottom: 1rem;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  background-color: #d4d4d4;
  padding: 0 1rem;
`

export const HeaderTitle = styled(H4)`
  font-weight: 600;
  margin-right: 0.5rem;
`

export const ItemsContainer = styled.div`
  transition: all ease-in 1s;
  height: auto;

  ${props =>
    props.isOpen === false &&
    `
    height: 0;
    overflow: hidden;
  `};
`

export const ArrowIcon = styled(ArrowDownIcon)`
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5rem;
  cursor: pointer;
  fill: #000 !important;
  transition: all ease-in 0.2s;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'initial')};
`

/* item rows */
export const RowContainer = styled.div`
  border-bottom: solid 1px #f2f2f2;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`

export const RowLeftColumn = styled.div`
  display: flex;
`

export const RowRightColumn = styled.div`
  display: flex;
  align-items: center;
`

export const RowTitle = styled(H4)`
  font-weight: 600px;

  :hover {
    cursor: pointer;
    color: #003bdf;
  }
`

export const RowArrowIcon = styled(ArrowDownIcon)`
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5rem;
  cursor: pointer;
  fill: #000 !important;
  transition: all ease-in 0.1s;

  transform: ${({ isOpen }) => (isOpen ? 'inherit' : 'rotateZ(-90deg)')};
`

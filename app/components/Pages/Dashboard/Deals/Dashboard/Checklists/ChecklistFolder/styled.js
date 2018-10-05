import styled from 'styled-components'

import { H4 } from 'components/Typography/headings'
import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const Container = styled.div`
  border-radius: 3px;
  background-color: #fff;
  border: solid 1px #d4d4d4;
  margin-bottom: 1rem;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.5rem;
  background-color: #d4d4d4;
  padding: 0 1rem;
`

export const HeaderLeftColumn = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderTitle = styled(H4)`
  font-weight: 600;
`

export const TasksContainer = styled.div`
  transition: all ease-in 1s;
  height: auto;

  ${props =>
    props.isOpen === false &&
    `
    height: 0;
    overflow: hidden;
  `};
`

export const ArrowIcon = ArrowDownIcon.extend`
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5rem;
  cursor: pointer;
  fill: #000 !important;
  transition: all ease-in 0.2s;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'initial')};
`

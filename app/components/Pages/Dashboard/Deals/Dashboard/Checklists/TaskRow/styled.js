import styled from 'styled-components'

import { H4 } from 'components/Typography/headings'

import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const Container = styled.div`
  border-bottom: solid 1px #f2f2f2;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  :hover {
    svg.deal--task-comments path {
      fill: #17181a;
    }
  }
`

export const LeftColumn = styled.div`
  display: flex;
`

export const RightColumn = styled.div`
  display: flex;
`

export const Title = styled(H4)`
  font-weight: 600px;

  :hover {
    cursor: pointer;
    color: #003bdf;
  }
`

export const ArrowIcon = styled(ArrowDownIcon)`
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5rem;
  cursor: pointer;
  fill: #000 !important;
  transition: all ease-in 0.1s;

  transform: ${({ isOpen }) => (isOpen ? 'inherit' : 'rotateZ(-90deg)')};
`

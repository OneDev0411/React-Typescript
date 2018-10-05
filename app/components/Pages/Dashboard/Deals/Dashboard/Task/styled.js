import styled from 'styled-components'

import { H4 } from 'components/Typography/headings'

import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: solid 1px #f2f2f2;
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

export const ArrowIcon = ArrowDownIcon.extend`
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.5rem;
  cursor: pointer;
  fill: #000 !important;
  transition: all ease-in 0.5s;

  transform: ${({ isOpen }) => (isOpen ? 'inherit' : 'rotateZ(-90deg)')};
`

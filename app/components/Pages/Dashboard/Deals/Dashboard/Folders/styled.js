import styled from 'styled-components'

import { H4 } from 'components/Typography/headings'
import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import { primary } from 'views/utils/colors'

import { Container as ActionsButton } from '../../components/ActionsButton/styled'

import { Container as Notification } from './Checklist/Notification/styled'
import { LastActivity } from './Checklist/TaskRow/Activity/styled'

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
  padding: 0 calc(1rem + 3px);
`

export const HeaderTitle = styled(H4)`
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
  transform: ${({ isOpen }) => (isOpen ? 'inherit' : 'rotateZ(-90deg)')};
  opacity: ${props => (props.display === false ? 0 : 1)};
`

/* item rows */
export const RowContainer = styled.div`
  border-bottom: solid 1px #f2f2f2;
  border-left: 3px solid transparent;

  ${props =>
    props.isTaskExpanded &&
    `
      :nth-child(even) {
        border-left: 3px solid #000;
      }

      :nth-child(odd) {
        border-left: 3px solid ${primary};
      }

      ${ActionsButton} {
        opacity: 1;
        border: 1px solid #d4d4d4;
      }

      ${LastActivity} {
        display: block;
        color: #000;
      }
      
      ${Notification} {
        svg > path {
          fill: #000;
        }
      }
  `}

  :hover ${ActionsButton} {
    opacity: 1;
    border: 1px solid #d4d4d4;
  }

  :hover ${LastActivity} {
    display: block;
    color: #000;
  }

  :hover ${Notification} {
    svg > path {
      fill: #000;
    }
  }
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`

export const TaskInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.75rem;
  padding-left: 2rem;
`

export const RowArrowIcon = styled(ArrowIcon)`
  align-self: flex-start;
  margin-top: 1px;
`

export const RowTitle = styled(H4)`
  font-weight: 600px;
  margin-bottom: 0.75rem;

  ${props =>
    props.hoverable &&
    `
    :hover {
      cursor: pointer;
      color: #003bdf;
    }
  `}
`

export const Activities = styled.div`
  display: flex;
  align-items: center;

  :hover ${Notification} {
    svg > path {
      fill: ${primary};
    }
  }
`

export const LabelItem = styled.div`
  display: inline-flex;
  align-items: center;
  color: #4d4d4d;
  border-radius: 12px;
  background-color: #e6e6e6;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 5rem;
  border-radius: 0.75rem;
  margin-right: 0.5rem;
  max-height: 1.5rem;
`

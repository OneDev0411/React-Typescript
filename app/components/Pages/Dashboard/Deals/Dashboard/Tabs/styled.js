import styled from 'styled-components'
import { Link } from 'react-router'

import AbstractCard from 'components/Card'
import { borderColor } from 'views/utils/colors'

export const Container = styled.div`
  padding: 0 2.5rem;
`

export const TabContent = styled.div`
  display: flex;
  overflow-x: hidden;
`

export const Card = styled(AbstractCard)`
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px ${borderColor};
  box-shadow: none;
`

export const FactsheetContainer = styled.div`
  overflow: hidden;
  width: 21rem;
`

export const MainContainer = styled.div`
  flex: 1;
  margin-left: 1.5rem;
`

export const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background-color: #fff;
  border: solid 1px #d4d4d4;
  margin: 1.5rem 0;
`

export const NavItem = styled(Link)`
  margin: 0 4.25rem;
  font-size: 1.25rem;
  padding: 0.6rem 0;
  font-weight: 500;
  color: #7f7f7f;
  cursor: ${props => (props.isDisabled ? 'not-allowed' : 'pointer')};
  border-bottom: 2px solid transparent;

  :hover,
  :focus {
    text-decoration: none;
  }

  ${props =>
    props.isActive &&
    `
  
    color: #003bdf;
    font-weight: bold;
    border-bottom-color: #003bdf;
  `};
`

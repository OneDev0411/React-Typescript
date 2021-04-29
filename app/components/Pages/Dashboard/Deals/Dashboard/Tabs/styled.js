import styled, { css } from 'styled-components'
import { Link } from 'react-router'

import AbstractCard from 'components/Card'

export const Container = styled.div`
  padding: 0 2.5rem;
`

export const TabContent = styled.div`
  display: flex;
`

export const Card = styled(AbstractCard)`
  border-radius: 3px;
  background-color: #fff;
  border: solid 1px ${({ theme }) => theme.palette.divider};
  box-shadow: none;
`

export const FactsheetContainer = styled.div`
  min-width: 21rem;
`

export const MainContainer = styled.div`
  flex-grow: 1;
  margin-left: 1rem;
`

export const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background-color: #fff;
  border: solid 1px ${({ theme }) => theme.palette.divider};
  margin-bottom: 1.5rem;
`

export const NavItem = styled(Link)`
  ${({ theme, isDisabled }) => css`
    margin: ${theme.spacing(0, 8)};
    padding: ${theme.spacing(1, 0)};
    color: #7f7f7f;
    cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
    border-bottom: 2px solid transparent;
    ${theme.typography.body1};

    :hover,
    :focus {
      text-decoration: none;
    }

    ${props =>
      props.isActive &&
      `
      color: ${theme.palette.primary.main};
      font-weight: bold;
      border-bottom-color: ${theme.palette.primary.main};
    `};
  `}
`

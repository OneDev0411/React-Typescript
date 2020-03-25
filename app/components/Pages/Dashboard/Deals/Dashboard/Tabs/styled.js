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
  width: 21rem;
`

export const MainContainer = styled.div`
  width: calc(100% - 22.5rem);
  margin-left: 1.5rem;
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
    margin: 0 4.25rem;
    font-size: 1.25rem;
    padding: 0.6rem 0;
    font-weight: 500;
    color: #7f7f7f;
    cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
    border-bottom: 2px solid transparent;

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

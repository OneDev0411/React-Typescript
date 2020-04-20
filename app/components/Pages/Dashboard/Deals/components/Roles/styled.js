import styled, { css } from 'styled-components'

import { SectionTitle } from '../../Dashboard/Factsheet/styled'

export const RolesContainer = styled.div`
  position: relative;
`

export const RolesTitle = styled(SectionTitle)`
  ${({ theme }) => css`
    padding: ${theme.spacing(0, 3)};
    margin-bottom: ${theme.spacing(3)}px;
    ${theme.typography.subtitle1};
  `}
`

export const RoleActions = styled.div`
  opacity: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const RoleAvatar = styled.div`
  text-align: center;
  width: 32px;
`

export const RoleInfo = styled.div`
  text-align: left;
  padding-left: 0.625rem;
`

export const RoleTitle = styled.div`
  color: #263445;
`

export const RoleType = styled.div`
  color: #8696a4;
  text-decoration: none;
`

export const RoleItem = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 3px;
    margin-bottom: 1rem;
    padding: 0 1.5rem;
    cursor: pointer;
    position: relative;
    ${theme.typography.body2};

    :hover {
      background: ${props =>
        props.noBackgroundHover ? 'transparent' : '#f0f4f7'};
      border-radius: 0;
    }

    :hover ${RoleActions} {
      opacity: 1;
    }

    :hover ${RoleTitle} {
      color: ${({ theme }) => theme.palette.secondary.main};
      text-decoration: underline;
    }
  `}
`

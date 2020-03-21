import styled from 'styled-components'

import { SectionTitle } from '../../Dashboard/Factsheet/styled'

export const RolesContainer = styled.div`
  position: relative;
`

export const RolesTitle = styled(SectionTitle)`
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
`

export const RoleActions = styled.div`
  opacity: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  button {
    height: 1.6rem;
    line-height: 1.6rem;
  }
`

export const RoleAvatar = styled.div`
  text-align: center;
  width: 45px;
`

export const RoleInfo = styled.div`
  text-align: left;
  padding-left: 0.625rem;
`

export const RoleTitle = styled.div`
  color: #263445;
  font-size: 1rem;
`

export const RoleType = styled.div`
  font-weight: normal;
  color: #8696a4;
  font-size: 1rem;
  text-decoration: none;
`

export const RoleItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 3px;
  margin-bottom: 1rem;
  padding: 0 1.5rem;
  cursor: pointer;
  position: relative;

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
`

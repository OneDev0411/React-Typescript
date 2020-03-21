import styled from 'styled-components'

import {
  RoleItem,
  RoleTitle as Title
} from '../../../../../components/Roles/styled'

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  line-height: 1.5;
  color: #7f7f7f;
  margin: 0.5rem 0;
`

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  box-shadow: 0 1px 0 0 #f5f5f5;
  margin-bottom: 0.5rem;

  button svg {
    fill: ${({ theme }) => theme.palette.common.black} !important;
  }
`

export const RoleTitle = styled(Title)`
  font-weight: 500;
`

export const Role = styled(RoleItem)`
  margin: 0;
  padding: 0 0 0.5rem 0;
  text-align: left;

  :hover {
    cursor: auto;
    background-color: transparent;
  }

  :hover ${RoleTitle} {
    text-decoration: none;
    color: #000;
  }
`

export const OrderCell = styled.div`
  width: 15%;
`

export const RoleCell = styled.div`
  width: 55%;
`

export const RecipientTypeCell = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 25%;
`

export const DeleteCell = styled.div`
  width: auto;
  text-align: right;
`

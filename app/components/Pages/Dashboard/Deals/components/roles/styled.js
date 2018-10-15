import styled from 'styled-components'

export const RolesContainer = styled.div`
  margin-bottom: 2rem;
`

export const RolesTitle = styled.div`
  padding-bottom: 5px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1d364b;
  border-bottom: 1px solid rgba(220, 225, 229, 0.5);
`

export const RoleActions = styled.div`
  width: 5%;
  opacity: 0;
  text-align: right;
`

export const RoleItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 3px;
  margin-bottom: 7px;
  cursor: pointer;

  :hover {
    background: ${props =>
      props.noBackgroundHover ? 'transparent' : '#f0f4f7'};
  }

  :hover ${RoleActions} {
    opacity: 1;
  }
`

export const RoleAvatar = styled.div`
  text-align: center;
  width: 35px;

  img {
    height: 21px;
  }
`

export const RoleInfo = styled.div`
  width: calc(100% - 35px);
  text-align: left;
  padding-left: 8px;
`

export const RoleTitle = styled.div`
  color: #263445;
  font-weight: 500;
`

export const RoleType = styled.div`
  font-weight: normal;
  color: #8696a4;
  font-size: 14px;
  text-decoration: none;
`

import styled, { css } from 'styled-components'

export const RolesContainer = styled.div`
  position: relative;
`

export const RoleActions = styled.div`
  opacity: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const RoleAvatar = styled.div`
  text-align: center;
`

export const RoleInfo = styled.div`
  display: flex;
`

export const RoleTitle = styled.div`
  margin: 0 0.5rem;
`

export const RoleType = styled.div`
  color: ${({ theme }) => theme.palette.grey['500']};
  text-decoration: none;
`

export const RoleItem = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.5rem 0.5rem 0.5rem;
    padding: 0.25rem 1rem;
    cursor: pointer;
    position: relative;
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    ${theme.typography.body2};

    :hover {
      background: ${props =>
        props.noBackgroundHover ? 'transparent' : 'rgba(0, 0, 0, 0.08)'};
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

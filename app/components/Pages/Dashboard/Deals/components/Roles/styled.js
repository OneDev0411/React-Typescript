import styled, { css } from 'styled-components'

export const RolesContainer = styled.div`
  position: relative;
`

export const RoleActions = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing(2)}px;
  top: 0;
  height: 100%;
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
  align-items: center;

  svg {
    display: none;
    color: ${({ theme }) => theme.palette.secondary.main};
  }
`

export const RoleTitle = styled.div`
  margin: 0 0.5rem;
`

export const RoleType = styled.div`
  color: ${({ theme }) => theme.palette.grey['500']};
  text-decoration: none;
  text-align: right;
  font-size: ${({ theme }) => theme.typography.body3.fontSize};
`

export const RoleItem = styled.div`
  ${({ theme, allowDeleteRole }) => css`
    position: relative;
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

    :hover ${RoleInfo} {
      svg {
        display: block;
      }
    }

    ${allowDeleteRole &&
    `
      :hover ${RoleType} {
        opacity: 0;
      }
    `}
  `}
`

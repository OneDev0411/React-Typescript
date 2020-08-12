import styled, { css } from 'styled-components'
import { Theme } from '@material-ui/core'

interface PrimaryActionProps {
  hasSecondaryActions: boolean
}

interface MenuItemProps {
  disabled: boolean
  theme: Theme
}

export const PrimaryAction = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    ${theme.typography.body2};

    width: ${(props: PrimaryActionProps) =>
      props.hasSecondaryActions ? '8rem' : '9.3rem'};

    :hover {
      color: ${theme.palette.secondary.main};
      background-color: ${theme.palette.action.hover};
    }

    :active {
      background-color: ${theme.palette.action.selected};
    }
  `}
`

export const MenuButton = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid ${theme.palette.divider};
    border-radius: 0 3px 3px 0;
    width: 2.3rem;

    :hover,
    :focus {
      color: ${theme.palette.secondary.main};
      background-color: ${theme.palette.action.hover};

      svg {
        transition: 0.1s ease-in transform;
        fill: ${theme.palette.secondary.main};
      }
    }

    :active {
      background-color: ${theme.palette.action.selected};
    }
  `}
`

export const Container = styled.div<{
  theme: Theme
}>`
  ${({ theme }) => css`
    display: flex;
    height: 2.3rem;
    opacity: 0.3;
    border-radius: 3px;
    border: 1px solid ${theme.palette.divider};
    cursor: pointer;

    :hover {
      border-color: ${theme.palette.action.selected};
    }
  `}
`

export const MenuContainer = styled.div`
  left: 0;
  right: 0;
  position: absolute;
  margin-top: 0.5rem;
  background-color: #fff;
  overflow: auto;
  border-radius: 3px;
  z-index: 1;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);
`

export const MenuItem = styled.div<MenuItemProps>`
  ${({ theme, disabled }) => css`
    color: ${disabled ? theme.palette.grey['900'] : theme.palette.common.black};
    padding: ${theme.spacing(1, 2)};
    ${theme.typography.body2};

    ${(props: MenuItemProps) =>
      props.disabled === false &&
      `
        :hover {
          cursor: pointer;
          background-color: ${theme.palette.action.hover};
          color: ${theme.palette.secondary.main};
        }
      `}
  `}
`

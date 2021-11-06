import { Theme } from '@material-ui/core'
import styled, { css } from 'styled-components'

interface PrimaryActionProps {
  hasSecondaryActions: boolean
}

interface MenuItemProps {
  disabled: boolean
  theme: Theme
}

export const PrimaryAction = styled.div<{
  hasSecondaryActions: boolean
}>`
  ${({ theme, hasSecondaryActions }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    ${theme.typography.subtitle2};

    width: ${(props: PrimaryActionProps) =>
      props.hasSecondaryActions ? '8.5rem' : 'auto'};
    padding: ${(props: PrimaryActionProps) =>
      props.hasSecondaryActions ? 'auto' : '0 0.5rem'};

    :hover {
      color: ${theme.palette.secondary.main};
      background-color: ${theme.palette.action.hover};
    }

    :active {
      background-color: ${theme.palette.action.selected};
    }

    ${!hasSecondaryActions &&
    `
      border-radius: ${theme.shape.borderRadius}px;

      &.Add {
        &:before {
          content '+';
          padding-right: 0.5rem;
        }

        color: #fff;
        border: 1px solid ${theme.palette.secondary.main};
        background-color: ${theme.palette.secondary.main};
      }

      &.Remove {
        &:before {
          content '× ';
          padding-right: 0.5rem;
        }

        color: ${theme.palette.error.main};
        border: 1px solid ${theme.palette.error.main};
      }
    `}
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
    height: ${theme.spacing(4)}px;
    border-radius: ${theme.shape.borderRadius}px;
    background-color: #fff;
    cursor: pointer;
    border: 1px solid ${theme.palette.divider};

    :hover {
      border-color: ${theme.palette.action.selected};
    }
  `}
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

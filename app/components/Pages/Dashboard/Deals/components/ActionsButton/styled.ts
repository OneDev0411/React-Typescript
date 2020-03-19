import styled, { css } from 'styled-components'

interface PrimaryActionProps {
  hasSecondaryActions: boolean
}

interface MenuItemProps {
  disabled: boolean
}

export const PrimaryAction = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 500;
    height: 100%;
    width: ${(props: PrimaryActionProps) =>
      props.hasSecondaryActions ? '7rem' : '9.3rem'};

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

export const Container = styled.div`
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
`

export const MenuItem = styled.div`
  ${({ theme }) => css`
    color: ${(props: MenuItemProps) => (props.disabled ? 'gray' : '#000')};
    padding: ${theme.spacing(1, 2)};

    ${(props: MenuItemProps) =>
      props.disabled === false &&
      css`
        :hover {
          cursor: pointer;
          background-color: ${theme.palette.action.hover};
          color: ${theme.palette.secondary.main};
        }
      `}
  `}
`

import styled, { css } from 'styled-components'

import { primary } from 'views/utils/colors'

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
      props.hasSecondaryActions ? '10rem' : '12.3rem'};

    :hover {
      color: ${primary};
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
      background-color: ${theme.palette.action.hover};

      svg {
        transition: 0.1s ease-in transform;
        fill: ${primary};
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
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);
`

export const MenuItem = styled.div`
  ${({ theme }) => css`
    font-size: 1rem;
    font-weight: 500;
    color: ${(props: MenuItemProps) => (props.disabled ? 'gray' : '#000')};
    padding: 0.5rem 1rem;

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

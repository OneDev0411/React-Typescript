import styled, { css } from 'styled-components'

import { grey, primary } from 'views/utils/colors'

export const PrimaryActionButton = styled.button`
  outline: none;
  color: ${grey.A900};
  background: ${grey.A250};
  border: 1px solid ${grey.A300};
  border-radius: 3px 0 0 3px;
  padding: 0.4rem 0.7rem;

  &:hover {
    background: ${grey.A300};
    color: ${primary};
  }
`

export const ToggleActionsMenuButton = styled.button<{ isActive?: boolean }>`
  outline: none;
  background: ${grey.A250};
  border: 1px solid ${grey.A300};
  border-left: none;
  border-radius: 0 3px 3px 0;
  padding: 0.2rem 0.4rem;

  & > svg {
    fill: ${grey.A900};
  }

  ${({ isActive }) =>
    isActive &&
    css`
      background: ${grey.A300};
      & > svg {
        fill: ${primary};
      }
    `}
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  transition: 0.2s border-color ease-in;
`

export const SplitButtonMenu = styled.div`
  position: absolute;
  min-width: 100%;
  right: 0;
  z-index: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 0.3rem;
  background: #fff;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16), 0 2px 24px 0 rgba(0, 0, 0, 0.15);
`

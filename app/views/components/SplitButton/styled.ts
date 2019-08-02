import styled, { css, ThemeProps } from 'styled-components'

import { Theme } from '@material-ui/core'

import { grey, primary } from 'views/utils/colors'

interface Props extends ThemeProps<Theme> {
  appearance?: 'primary'
}

const themeWhite = ({ theme }: { theme: Theme }) => theme.palette.common.white
const appearance = ({ appearance }: { appearance?: 'primary' }) =>
  appearance === 'primary'
    ? css`
        background: ${primary};
        color: ${themeWhite};
      `
    : css`
        color: ${({ theme }: { theme: Theme }) => theme.palette.common.black};
        background: ${grey.A250};

        & > svg {
          fill: ${grey.A900};
        }

        &:hover:not(:disabled) {
          background: ${grey.A300};
          color: ${primary};
        }
      `

const toggleButtonAppearance = ({
  appearance,
  isActive
}: {
  appearance?: 'primary'
  isActive?: boolean
}) => {
  return (
    appearance !== 'primary' &&
    isActive &&
    css`
      background: ${grey.A300};
      & > svg {
        fill: ${primary};
      }
    `
  )
}
export const PrimaryActionButton = styled.button<Props>`
  outline: none;
  ${appearance};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px 0 0 3px;
  padding: 0.4rem 0.7rem;
`

export const ToggleActionsMenuButton = styled.button<{
  isActive?: boolean
  appearance: 'primary'
}>`
  fill: ${themeWhite};
  outline: none;
  ${appearance};
  ${toggleButtonAppearance};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-left: none;
  border-radius: 0 3px 3px 0;
  padding: 0.2rem 0.4rem;
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
  z-index: 2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 0.3rem;
  background: #fff;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16), 0 2px 24px 0 rgba(0, 0, 0, 0.15);
`

import styled, { ThemeProps } from 'styled-components'

import { Theme } from '@material-ui/core'

import { LatoFamilyStyle } from '../../Typography/styles'

export const Container = styled.div`
  height: 4.5rem;
  padding: ${({ theme }: ThemeProps<Theme>) => theme.spacing(0, 3)};
  background-color: ${({ theme }: ThemeProps<Theme>) =>
    theme.palette.common.white};
  z-index: 2;

  & .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
  }

  &:after {
    border-bottom: 1px solid
      ${({ theme }: ThemeProps<Theme>) => theme.palette.divider};
    display: block;
    content: '';
  }
`

export const Title = styled.h2`
  ${LatoFamilyStyle};
  font-weight: 700;
  font-size: 1.25rem;
`

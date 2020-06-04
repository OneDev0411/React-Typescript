import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

import { borderColor } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${borderColor};
  margin-bottom: ${(props: ThemeProps<Theme>) => props.theme.spacing(3)}px;
  border-radius: ${(props: ThemeProps<Theme>) =>
    props.theme.shape.borderRadius}px;
`

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(1, 2)};
  border-bottom: 1px solid ${borderColor};

  &:last-child {
    border-bottom: none;
  }
`

export const HeaderContainer = styled(ItemContainer)`
  cursor: pointer;
  background-color: ${(props: ThemeProps<Theme>) =>
    props.theme.palette.background.default};

  &:hover {
    background-color: ${(props: ThemeProps<Theme>) =>
      props.theme.palette.action.hover};
  }
`

export const ItemDetailsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 2)};

  &:first-child {
    align-items: center;
    width: ${(props: ThemeProps<Theme>) => props.theme.spacing(4)}px;
  }
`

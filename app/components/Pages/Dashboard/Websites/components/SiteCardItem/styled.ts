import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const Actions = styled.div<ThemeProps<Theme>>`
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  padding: ${props => props.theme.spacing(2)}px;
  transition: 0.2s ease-in opacity;
`

export const ArtContainer = styled.div<ThemeProps<Theme>>`
  position: relative;
`

export const Art = styled.img<ThemeProps<Theme>>`
  width: 100%;
  border-radius: 4px;
  margin-bottom: ${props => props.theme.spacing(1)}px;
  transition: 0.2s ease-in opacity;
`

export const Link = styled.div<ThemeProps<Theme>>`
  margin-bottom: ${props => props.theme.spacing(1)}px;

  a {
    color: ${props => props.theme.palette.action.disabled};

    :hover {
      color: ${props => props.theme.palette.action.active};
    }
  }
`

export const Container = styled.div<ThemeProps<Theme>>`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  padding: ${props => props.theme.spacing(1)}px;
  margin-bottom: ${props => props.theme.spacing(1.5)}px;

  :hover {
    background: ${props => props.theme.palette.action.hover};
  }

  :hover ${Actions} {
    opacity: 1;
  }

  :hover ${Art} {
    opacity: 0.9;
  }
`

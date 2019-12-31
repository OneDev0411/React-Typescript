import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

import { borderColor } from 'views/utils/colors'

export const Container = styled.div<ThemeProps<Theme>>`
  width: 100%;
  border-radius: 4px;
  background-color: #fff;
  border: solid 1px ${borderColor};
`
export const MediaThumbnail = styled.img<ThemeProps<Theme>>`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing(1)}px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12),
    0px 2px 0px rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  transition: 0.2s ease-in opacity;
`
export const Actions = styled.div<ThemeProps<Theme>>`
  display: flex;
  flex-flow: row-reverse nowrap;
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

export const MediaThumbNailContainer = styled.div<ThemeProps<Theme>>`
  position: relative;
`
export const MediaCard = styled.div<ThemeProps<Theme>>`
  max-width: 300;
  padding: ${props => props.theme.spacing(1)}px;
  margin-right: ${props => props.theme.spacing(2)}px;
  margin-bottom: ${props => props.theme.spacing(2)}px;
  border-radius: 4px;

  :hover {
    background-color: ${props => props.theme.palette.action.hover};
  }

  :hover ${Actions} {
    opacity: 1;
  }

  :hover ${MediaThumbnail} {
    opacity: 0.9;
  }
`

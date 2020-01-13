import styled, { ThemeProps } from 'styled-components'

import { Theme } from '@material-ui/core'

import { headerHeight } from '../../variables'

export const SideMenuList = styled.ul`
  padding: 0;
  margin: 0;

  li > a {
    color: #000;
    padding: 0 0 0 1em;
    margin: 0;
    height: 40px;
    line-height: 40px;
    vertical-align: middle;
    border-radius: 0;
    text-decoration: none;
    display: block;
    white-space: nowrap;

    &:hover {
      color: #fff;
      background-color: ${({ theme }: ThemeProps<Theme>) =>
        theme.palette.primary.main};
    }
  }
`

export const SubTitle = styled.li`
  padding-left: ${({ theme }: ThemeProps<Theme>) => `${theme.spacing(2)}px`};
  line-height: 2.5;
  vertical-align: middle;
  color: ${({ theme }: ThemeProps<Theme>) => theme.palette.text.secondary};
  font-size: ${({ theme }: ThemeProps<Theme>) =>
    theme.typography.caption.fontSize};
`

export const SideMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  height: min-content;
  // we set a max height to prevent menu from being clipped when it's longer
  // than viewport height.
  max-height: calc(100vh - ${headerHeight}px);
  overflow: auto;
`

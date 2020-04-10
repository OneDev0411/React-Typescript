import { Link, LinkProps } from 'react-router'
import styled, { ThemeProps, css } from 'styled-components'
import { Badge } from '@material-ui/core'
import { Theme, withStyles } from '@material-ui/core/styles'

import { appSidenavWidth, backgroundColor } from './variables'

export const Sidenav = styled.aside`
  width: ${appSidenavWidth}px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background-color: ${backgroundColor};
`

export const SidenavListGroup = styled.ul`
  margin: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 0, 2, 0)};
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`

export const SideNavItem = styled.li`
  cursor: pointer;
  transition: background-color 0.2s ease-in;
  margin-bottom: ${(props: ThemeProps<Theme>) => props.theme.spacing(1)}px;
`

const itemStyle = css`
  padding-left: ${(props: ThemeProps<Theme>) =>
    `calc(${props.theme.spacing(3)}px - ${props.theme.spacing(0.5)}px)`};
  border-radius: 0;
  border-left: 4px solid transparent;
  color: ${(props: ThemeProps<Theme>) =>
    props.theme.palette.primary.contrastText};

  &:hover,
  &:focus {
    text-decoration: none;
    color: ${(props: ThemeProps<Theme>) => props.theme.palette.primary.light};
  }

  ${({ active }: ThemeProps<Theme> & { active: boolean }) =>
    active &&
    css`
      color: ${(props: ThemeProps<Theme>) => props.theme.palette.primary.light};
      border-left-color: ${(props: ThemeProps<Theme>) =>
        props.theme.palette.primary.light};
    `}
`

interface SidenavLinkPorps extends LinkProps {
  active?: boolean
}

export const SidenavLink = styled(Link)<SidenavLinkPorps>`
  display: inline-block;
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.body1.fontSize};
  line-height: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.body1.lineHeight};
  ${itemStyle}
`

export const Avatar = styled.div`
  display: inline-block;
  text-align: center;
  color: ${(props: ThemeProps<Theme>) => props.theme.palette.common.white};
  border-radius: 100%;
  background: #000;
  font-weight: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.fontWeightBold};
  img {
    width: 100%;
    height: 100%;
    border-radius: inherit;

    &[alt] {
      font-size: 0;
    }
  }
`
export const Divider = styled.div`
  height: 1px;
  margin: 0;
  overflow: hidden;
  background-color: ${(props: ThemeProps<Theme>) =>
    props.theme.palette.divider};
`
export const ListItemDivider = Divider.withComponent('li')

export const AppNavbarBadge = withStyles((theme: Theme) => ({
  anchorOriginTopRightRectangle: {
    top: theme.spacing(-1),
    right: 'auto',
    left: `calc(100% + ${theme.spacing(1)}px)`,
    transform: 'scale(1) translateY(50%)'
  }
}))(Badge)

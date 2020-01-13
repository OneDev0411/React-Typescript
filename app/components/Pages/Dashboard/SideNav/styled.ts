import { Link, LinkProps } from 'react-router'
import styled, { ThemeProps, css } from 'styled-components'
import { Badge } from '@material-ui/core'
import { Theme, withStyles } from '@material-ui/core/styles'

import { borderColor } from '../../../../views/utils/colors'

import Button from '../../../../views/components/Button/ActionButton'

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
  margin: 0 0 1rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

export const SideNavItem = styled.li`
  cursor: pointer;
  transition: background-color 0.2s ease-in;
`

const itemStyle = css`
  padding-left: calc(2rem - 4px);
  border-radius: 0;
  border-left: 4px solid transparent;
  color: ${(props: ThemeProps<Theme>) =>
    props.theme.palette.secondary.contrastText};

  &:hover,
  &:focus {
    text-decoration: none;
    color: ${(props: ThemeProps<Theme>) => props.theme.palette.secondary.main};
  }

  ${({ active }: ThemeProps<Theme> & { active: boolean }) =>
    active &&
    css`
      color: ${(props: ThemeProps<Theme>) =>
        props.theme.palette.secondary.main};
      border-left-color: ${(props: ThemeProps<Theme>) =>
        props.theme.palette.secondary.main};
    `}
`

interface SidenavLinkPorps extends LinkProps {
  active?: boolean
}

export const SidenavLink = styled(Link)<SidenavLinkPorps>`
  display: inline-block;
  font-size: 1.125rem;
  line-height: 2;
  ${itemStyle}
`

export const SidenavButton = styled(Button)`
  border: none;
  background: transparent;
  &:focus {
    outline-width: 0;
  }
  ${itemStyle}
`

export const Avatar = styled.div`
  display: inline-block;
  text-align: center;
  color: #fff;
  border-radius: 100%;
  background: #000;
  font-weight: 700;
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
  background-color: ${borderColor};
`
export const ListItemDivider = Divider.withComponent('li')

export const AppNavbarBadge = withStyles(() => ({
  anchorOriginTopRightRectangle: {
    right: 'auto',
    left: 'calc(100% + 0.5rem)',
    transform: 'scale(1) translateY(50%)'
  }
}))(Badge)

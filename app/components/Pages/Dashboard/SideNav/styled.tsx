import { Theme, alpha } from '@material-ui/core/styles'
import { Link as RouterLink, LinkProps } from 'react-router'
import styled, { ThemeProps, css } from 'styled-components'

import { appSidenavWidth } from './variables'

export const Sidenav = styled.aside`
  width: ${appSidenavWidth}px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background-color: ${(props: ThemeProps<Theme>) =>
    props.theme.palette.navbar.background};
`

const itemStyle = css`
  display: flex;
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 0.5)};
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.body1.fontSize};
  align-items: center;
  border-radius: ${(props: ThemeProps<Theme>) =>
    `${props.theme.shape.borderRadius}px`};
  color: ${(props: ThemeProps<Theme>) => props.theme.palette.grey[400]};
  &:hover {
    text-decoration: none;
    color: ${(props: ThemeProps<Theme>) => props.theme.palette.primary.main};
  }
  &:focus {
    text-decoration: none;
    color: ${(props: ThemeProps<Theme>) => props.theme.palette.primary.main}};
  }
  height:${(props: ThemeProps<Theme>) => props.theme.spacing(4)}px;
  ${({ active }: ThemeProps<Theme> & { active: boolean }) =>
    active &&
    // !important was added to prevent :hover and :focus to change :active item
    css`
      color: ${(props: ThemeProps<Theme>) =>
        props.theme.palette.common.white} !important;
        font-weight: ${(props: ThemeProps<Theme>) =>
          props.theme.typography.fontWeightBold}};
      background-color: ${(props: ThemeProps<Theme>) =>
        alpha(props.theme.palette.navbar.contrastText, 0.24)};

      svg {
        color: ${(props: ThemeProps<Theme>) =>
          props.theme.palette.primary.main}};
      }
    `}

  svg {
    position: relative;
    top: ${(props: ThemeProps<Theme>) => props.theme.spacing(-0.125)}px;
  }
`

interface SidenavLinkPorps extends LinkProps {
  active?: boolean
}

const linkStyle = css`
  display: inline-block;
  width: 100%;
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.body1.fontSize};
  line-height: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.body1.lineHeight};
  font-weight: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.body1.fontWeight};
  cursor: pointer;
  ${itemStyle}
`

const WrappedRouterLink = ({ active, ...rest }: SidenavLinkPorps) => (
  <RouterLink {...rest} />
)

export const SidenavLinkSummary = styled(WrappedRouterLink)<SidenavLinkPorps>`
  ${linkStyle}
  margin: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 1, 0, 0)};
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 1, 0, 2)};
  border-radius: ${(props: ThemeProps<Theme>) =>
    props.theme.spacing(0, 0.5, 0.5, 0)};
`

export const SidenavLink = styled(WrappedRouterLink)<SidenavLinkPorps>`
  ${linkStyle}
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 1, 0, 2.5)};
  border-radius: ${(props: ThemeProps<Theme>) =>
    props.theme.spacing(0, 0.5, 0.5, 0)};
  margin: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 0, 1, 0)};
`

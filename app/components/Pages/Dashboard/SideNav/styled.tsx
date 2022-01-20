import { Link } from '@material-ui/core'
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

export const SidenavListGroup = styled.ul`
  margin: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 2)};
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`

export const SideNavItem = styled.li`
  cursor: pointer;
  transition: background-color 0.2s ease-in;
  width: 100%;
  margin-bottom: ${(props: ThemeProps<Theme>) => props.theme.spacing(1)}px;
`

export const SideNavItemLabel = styled.div`
  padding-left: ${(props: ThemeProps<Theme>) => props.theme.spacing(3)}px;
`

const itemStyle = css`
  display: flex;
  padding: ${(props: ThemeProps<Theme>) =>
    props.theme.spacing(0.75, 0.5, 0.5, 1)};
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.body2.fontSize};
  align-items: center;
  border-radius: ${(props: ThemeProps<Theme>) =>
    `${props.theme.shape.borderRadius}px`};
  color: ${(props: ThemeProps<Theme>) =>
    alpha(props.theme.palette.navbar.contrastText, 1)};
  &:hover {
    text-decoration: none;
    color: ${(props: ThemeProps<Theme>) => props.theme.palette.primary.main};
  }
  &:focus {
    text-decoration: none;
    color: ${(props: ThemeProps<Theme>) => props.theme.palette.primary.main}};
  }
  ${({ active }: ThemeProps<Theme> & { active: boolean }) =>
    active &&
    // !important was added to prevent :hover and :focus to change :active item
    css`
      color: ${(props: ThemeProps<Theme>) =>
        props.theme.palette.common.black} !important;
      background-color: ${(props: ThemeProps<Theme>) =>
        props.theme.palette.common.white};

      svg {
        color: ${(props: ThemeProps<Theme>) =>
          props.theme.palette.primary.main}};
      }
    `}

  svg {
    position: relative;
    top: ${(props: ThemeProps<Theme>) => props.theme.spacing(-0.25)}px;
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
  ${itemStyle}
`

const WrappedRouterLink = ({ active, ...rest }: SidenavLinkPorps) => (
  <RouterLink {...rest} />
)

export const SidenavLink = styled(WrappedRouterLink)<SidenavLinkPorps>`
  ${linkStyle}
`

export const SidenavBlankLink = styled(Link)`
  ${linkStyle}
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

export const AccordionSummaryDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

export const AccordionSummaryLabel = styled.span`
  position: relative;
`

export const AccordionSummaryDot = styled.span`
  display: inline-block;
  width: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(0.5)}px`};
  height: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(0.5)}px`};
  position: absolute;
  top: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(0.5)}px`};
  right: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(-1)}px`};
  border-radius: ${(props: ThemeProps<Theme>) =>
    `${props.theme.shape.borderRadius}px`};
  background-color: ${(props: ThemeProps<Theme>) =>
    props.theme.palette.primary.main};
`

export const SideNavButtonWithoutIconLabel = styled.span`
  padding-left: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(3)}px`};
`

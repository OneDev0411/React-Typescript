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
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`

export const SideNavItemLabel = styled.div`
  padding-left: ${(props: ThemeProps<Theme>) => props.theme.spacing(3)}px;
`

const itemStyle = css`
  display: flex;
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 0.5)};
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.body2.fontSize};
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
  height:${(props: ThemeProps<Theme>) => props.theme.spacing(3.25)}px;
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
  margin: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 0, 0.25, 0)};
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

export const AccordionSummaryDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

export const AccordionSummaryLabel = styled.span`
  position: relative;
  text-transform: capitalize;
`

export const AccordionSummaryDot = styled.span`
  display: inline-block;
  width: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(0.75)}px`};
  height: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(0.75)}px`};
  position: absolute;
  right: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(2.75)}px`};
  border-radius: ${(props: ThemeProps<Theme>) =>
    `${props.theme.shape.borderRadius}px`};
  background-color: ${(props: ThemeProps<Theme>) =>
    props.theme.palette.error.dark};
`

export const IconWrapper = styled.span`
  padding-left: ${(props: ThemeProps<Theme>) =>
    `${props.theme.spacing(0.5)}px`};
  display: flex;
  align-items: 'center';
`

export const AccordionSummaryIconWrapper = styled.span`
  margin-right: ${(props: ThemeProps<Theme>) =>
    `${props.theme.spacing(0.5)}px`};
  display: flex;
  align-items: 'center';
`

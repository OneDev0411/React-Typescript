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
  margin: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 2, 1, 2)};
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  & .MuiAccordion-root {
    background-color: transparent;

    &.Mui-expanded {
      margin: 0 !important;
    }
  }

  & .MuiAccordionSummary-root {
    padding: 0;
    min-height: 45px !important;

    &.Mui-expanded {
      min-height: 45px !important;
    }

    svg.MuiSvgIcon-root {
        color: ${(props: ThemeProps<Theme>) =>
          props.theme.palette.common.white};
        position: relative;
        top: -2px;
      }
    }
  }

  & .MuiAccordionSummary-content {
    display: flex;
    justify-content: flex-start;
    margin: 0 !important;

    a {
      width:100%;
      display: flex;
      justify-content: space-between
    }

    &.Mui-expanded {
      margin: 6px 0 !important;

      div {
        svg {
            color: ${(props: ThemeProps<Theme>) =>
              props.theme.palette.primary.light};
            }
        }
      }
    }
  }

  & .MuiAccordionDetails-root {
    padding: 0px 0px 8px;
    flex-direction: column;
  }
`

export const SideNavItem = styled.li`
  cursor: pointer;
  transition: background-color 0.2s ease-in;
  width: 100%;
  margin-bottom: ${(props: ThemeProps<Theme>) => props.theme.spacing(1)}px;

  & .MuiBadge-root {
    width: 100%;
    align-items: center;

    & .MuiBadge-anchorOriginTopRightRectangle {
      left: auto;
      right: 0;
      padding: 0 4px;
    }
  }
`

export const SideNavItemLabel = styled.div`
  padding-left: ${(props: ThemeProps<Theme>) => props.theme.spacing(3)}px;
`

const itemStyle = css`
  display: flex;
  font-size: 0.875rem;
  align-items: center;
  border-radius: 6px;
  padding-top: ${(props: ThemeProps<Theme>) => props.theme.spacing(0.5)}px;
  padding-right: ${(props: ThemeProps<Theme>) => props.theme.spacing(1)}px;
  padding-bottom: ${(props: ThemeProps<Theme>) => props.theme.spacing(0.5)}px;
  padding-left: ${(props: ThemeProps<Theme>) => props.theme.spacing(1)}px;
  color: ${(props: ThemeProps<Theme>) =>
    alpha(props.theme.palette.navbar.contrastText, 1)};
  &:hover,
  &:focus {
    text-decoration: none;
    color: ${(props: ThemeProps<Theme>) => props.theme.palette.common.black};
    background-color: ${(props: ThemeProps<Theme>) =>
      props.theme.palette.common.white};

    div {
      svg {
        color: ${(props: ThemeProps<Theme>) =>
          props.theme.palette.primary.main};
      }
    }
  }
  ${({ active }: ThemeProps<Theme> & { active: boolean }) =>
    active &&
    css`
      color: ${(props: ThemeProps<Theme>) => props.theme.palette.common.black};
      background-color: ${(props: ThemeProps<Theme>) =>
        props.theme.palette.common.white};
    `}

  svg {
    position: relative;
    top: -2px;
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
  display: flex;
  align-items: center;
`

import styled, { css } from 'styled-components'

import { borderColor, grey, primary } from '../../../../views/utils/colors'

import IconButton from '../../../../views/components/Button/IconButton'
import Badge from '../../../../views/components/Badge'
import Link from '../../../../views/components/Button/LinkButton'

import { appSidenavWidth, headerHeight, minItemHeight } from './variables'

const sidenavButtonStyles = css`
  padding: 0 !important;
  justify-content: center;
  line-height: ${minItemHeight}px;
  height: ${minItemHeight}px;
  width: ${minItemHeight}px;

  border-radius: 50%;

  &:hover {
    background-color: ${grey.A200};
    svg {
      fill: ${primary};
    }
  }

  ${({ active }) =>
    active &&
    css`
      background-color: #d9e6ff;
      svg {
        fill: ${primary};
      }
    `}
`
export const Sidenav = styled.aside`
  width: ${appSidenavWidth}px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-right: 1px solid ${grey.A100};
  display: flex;
  flex-direction: column;
`

export const UserMenuWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: ${headerHeight}px;
`
export const SidenavList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  max-height: 100%;
`

export const SidenavLink = styled(Link)`
  display: flex;
  position: relative;
  color: #000;
  font-size: 16px;

  ${sidenavButtonStyles}
`

export const SidenavIconButton = styled(IconButton)`
  border: none;
  background: transparent;
  justify-content: center;
  &:focus {
    outline-width: 0;
  }
  ${sidenavButtonStyles}
  svg {
    width: 24px;
    height: 24px;
  }
`

export const Avatar = styled.div`
  display: inline-block;
  text-align: center;
  color: #ffffff;
  border-radius: 100%;
  background: #000000;
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

export const SidenavBadge = styled(Badge)`
  position: absolute;
  top: 8px;
  left: 50%;
`

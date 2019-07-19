import styled from 'styled-components'

import { grey, primary } from '../../../../../../views/utils/colors'
import VerticalDotsIcon from '../../../../../../views/components/SvgIcons/VeriticalDots/VerticalDotsIcon'
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
      background-color: ${primary};
    }
  }
`

export const SubTitle = styled.li`
  padding-left: 16px;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  background-color: ${grey.A100};
  box-shadow: 0 1px 0 0 #e9e9e9;
  font-size: 14px;
  color: #000;
`

export const SideMenuContainer = styled.div`
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  background-clip: padding-box;

  display: flex;
  flex-direction: column;

  position: absolute;
  z-index: 1000;
  left: 1rem;
  top: 80%;
  bottom: auto;

  width: 250px;
  height: min-content;
  // we set a max height to prevent menu from being clipped when it's longer
  // than viewport height.
  max-height: calc(100vh - ${headerHeight}px);
  overflow: auto;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid ${grey.A300};
`

export const DropdownDots = styled(VerticalDotsIcon)`
  width: 1rem !important;
  fill: ${grey.A500}!important;
  margin: 0 -0.11rem;
`

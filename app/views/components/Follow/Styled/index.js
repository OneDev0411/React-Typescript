import styled from 'styled-components'
import ShadowButton from '../../Button/ShadowButton'
import UpArrow from '../../SvgIcons/KeyboardArrowUp/IconKeyboardArrowUp'
import DownArrow from '../../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { primary, grey, borderColor, primaryDark } from '../../../utils/colors'

export const DropDownContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  border: solid 1px
    ${({ isFollowing }) => (isFollowing ? borderColor : primary)};
  border-radius: 3px;
  background-color: #fff;
  height: 32px;
`

export const DropDownMenu = styled.div`
  position: absolute;
  width: 210px;
  padding: 1em;
  margin-top: 0.5em;
  z-index: 1000;
  background: #fff;
  border-radius: 6px;
  border: 1px solid ${borderColor};
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
`

export const DropDownMenuHeader = styled.div`
  font-weight: bold;
`

export const DropDownMenuItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1em;
`

export const DropDownMenuItemText = styled.div`
  margin-left: 11px;
`

export const FollowButton = styled.div`
  font-weight: normal;
  color: ${({ isFollowing }) => (isFollowing ? primaryDark : primary)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ isFollowing }) => (isFollowing ? '0 12px 0 0' : '1px 14px')};
  .followingIcon {
    margin-left: 4px;
    margin-right: 4px;
  }
  .followCloseIcon {
    display: none;
    width: 16px;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
  &:hover {
    background-color: ${grey.A100};

    .followBellIcon {
      display: none;
    }
    .followCloseIcon {
      display: block;
    }
  }
  &:focus {
    outline: none;
  }
  .arrowIcon {
    border-left: solid 1px ${borderColor};
    padding-left: 2px;
    margin-left: 4px;
    margin-right: 4px;
  }
`
export const ArrowButton = ShadowButton.extend`
  display: flex;
  border-left: solid 1px ${borderColor};
  padding-left: 6px;
  padding-right: 6px;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: ${grey.A100};
  }
`

export const DownArrowFollow = DownArrow.extend`
  > path {
    fill: ${primary};
  }
`

export const UpArrowFollow = UpArrow.extend`
  > path {
    fill: ${primary};
  }
`

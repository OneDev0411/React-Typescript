import styled from 'styled-components'
import ShadowButton from '../../Button/ShadowButton'

export const DropDownContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  border: solid 1px
    ${({ isFollowing }) => (isFollowing ? '#d4dfe6' : '#2196f3')};
  border-radius: 3px;
  background-color: #ffffff;
`

export const DropDownMenu = styled.div`
  position: absolute;
  right: ${({ rightAlign }) => (rightAlign ? '40px' : 'inherit')};
  z-index: 1000;
  background: #fff;
  width: 280px;
  border: 1px solid #eee;
  color: black;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  font-size: 17px;
  color: #263445;
  margin-top: 8px;
`

export const DropDownMenuHeader = styled.div`
  font-weight: bold;
`

export const DropDownMenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`

export const FollowButton = styled.div`
  font-weight: normal;
  color: ${({ isFollowing }) => (isFollowing ? '#263445' : '#2196f3')};
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
    margin-left: 8px;
    margin-right: 8px;
  }
  &:hover {
    background-color: #eff5fa;
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
    border-left: solid 1px #d4dfe6;
    padding-left: 2px;
    margin-left: 4px;
    margin-right: 4px;
  }
`
export const ArrowButton = ShadowButton.extend`
  border-left: solid 1px #d4dfe6;
  padding-left: 6px;
  padding-top: 2px;
  padding-right: 6px;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #eff5fa;
  }
`

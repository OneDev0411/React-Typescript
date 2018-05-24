import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ShadowButton from '../Button/ShadowButton'
import IconBell from '../SvgIcons/Bell/IconBell'
import CloseIcon from '../SvgIcons/Close/CloseIcon'
import ToolTip from '../tooltip'

const propTypes = {
  isFollowing: PropTypes.bool,
  isFetching: PropTypes.bool
}

const FollowButton = ShadowButton.extend`
  font-weight: normal;
  border-radius: 3px;
  color: ${({ isFollowing }) => (isFollowing ? '#263445' : '#2196f3')};
  border: solid 1px
    ${({ isFollowing }) => (isFollowing ? '#d4dfe6' : '#2196f3')};
  display: flex;
  align-items: center;
  padding: ${({ isFollowing }) => (isFollowing ? '0 8px 0 0' : '1px 14px')};

  .followingIcon {
    margin-left: 4px;
    margin-right: 4px;
  }
  .followCloseIcon {
    display: none;
    width: 16px;
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
`

const FollowComponent = ({ isFollowing, onClick, isFetching }) => (
  <ToolTip
    placement="bottom"
    caption={
      isFollowing
        ? 'You will NOT receive updates via email & push notifications when any changes to a property take place.'
        : 'You will receive updates via email & push notifications when any changes to a property take place.'
    }
  >
    <FollowButton isFollowing={isFollowing} onClick={onClick}>
      {isFetching && <i className="fa fa-spinner fa-spin followingIcon" />}
      {isFollowing ? (
        <Fragment>
          <IconBell className="followBellIcon followingIcon" />
          <CloseIcon className="followCloseIcon followingIcon" />
          Following
        </Fragment>
      ) : (
        'Follow'
      )}
    </FollowButton>
  </ToolTip>
)

FollowComponent.propTypes = propTypes

export default FollowComponent

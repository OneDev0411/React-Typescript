import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import Radio from '../radio'
import IconBell from '../SvgIcons/Bell/IconBell'
import CloseIcon from '../SvgIcons/Close/CloseIcon'
import UpArrow from '../SvgIcons/UpArrow/UpArrow'
import DownArrow from '../SvgIcons/DownArrow/DownArrow'
import ToolTip from '../tooltip'
import {
  DropDownContainer,
  DropDownMenu,
  DropDownMenuItem,
  DropDownMenuHeader,
  FollowButton,
  ArrowButton
} from './Styled'

const propTypes = {
  isFetching: PropTypes.bool
}

const DownArrowFollow = DownArrow.extend`
> path {
fill: #506379
`

const UpArrowFollow = UpArrow.extend`
> path {
fill: #506379
`
const FollowComponent = ({
  onClick,
  isFetching,
  isMenuOpen,
  onChangeMenuOpen,
  statuses,
  activeStatuses = [],
  onFollowClick,
  rightAlign = false
}) => {
  const isFollowing = activeStatuses.length > 0

  return (
    <Downshift
      isOpen={isMenuOpen}
      onOuterClick={onChangeMenuOpen}
      onChange={selection => alert(`You selected ${selection.value}`)}
      itemToString={item => (item ? item.value : '')}
    >
      {({ isOpen }) => (
        <div>
          <DropDownContainer isFollowing={isFollowing}>
            <ToolTip
              placement="bottom"
              caption={
                isFollowing
                  ? 'You will NOT receive updates via email & push notifications when any changes to a property take place.'
                  : 'You will receive updates via email & push notifications when any change to a property in this saved search take place.'
              }
            >
              <FollowButton isFollowing={isFollowing} onClick={onFollowClick}>
                {isFetching && (
                  <i className="fa fa-spinner fa-spin followingIcon" />
                )}
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
            {isFollowing && (
              <ArrowButton onClick={onChangeMenuOpen}>
                {isOpen ? <UpArrowFollow /> : <DownArrowFollow />}
              </ArrowButton>
            )}
          </DropDownContainer>
          {isOpen ? (
            <DropDownMenu rightAlign={rightAlign}>
              <DropDownMenuHeader>Notify me when:</DropDownMenuHeader>
              {statuses.map(item => (
                <DropDownMenuItem key={item.value}>
                  {item.value}
                  <Radio
                    selected={activeStatuses.includes(item.key)}
                    square
                    onClick={() => {
                      let newActiveStatuses

                      if (activeStatuses.includes(item.key)) {
                        newActiveStatuses = activeStatuses.filter(
                          status => status !== item.key
                        )
                      } else {
                        newActiveStatuses = activeStatuses.concat(item.key)
                      }

                      onClick(newActiveStatuses)
                    }}
                  />
                </DropDownMenuItem>
              ))}
            </DropDownMenu>
          ) : null}
        </div>
      )}
    </Downshift>
  )
}

FollowComponent.propTypes = propTypes

const enhance = compose(
  withState('isMenuOpen', 'setIsMenuOpen', false),
  withHandlers({
    onChangeMenuOpen: props => () => {
      props.setIsMenuOpen(!props.isMenuOpen)
    },
    onFollowClick: props => () => {
      if (props.activeStatuses.length === 0) {
        props.onClick(props.statuses.map(status => status.key))
      } else {
        props.onClick([])
      }
    }
  })
)
export default enhance(FollowComponent)

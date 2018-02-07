import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import _ from 'underscore'
import cn from 'classnames'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import SocketStatus from '../SocketStatus'
import CreateRoom from './create-room'
import UserAvatar from '../../../../Partials/UserAvatar'
import UserTyping from '../UserTyping'
import TwoDirectionArrow from '../../Partials/Svgs/TwoDirectionArrow'
import SearchInput from '../../../../Partials/SearchInput'

import {
  toggleInstantMode,
  changeActiveRoom,
  toggleChatbar
} from '../../../../../store_actions/chatroom'

class Rooms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: ''
    }
  }

  onChangeFilter(filter) {
    this.setState({ filter })
  }

  /**
   * toggle full screen chatroom
   */
  fullScreen(e) {
    e.preventDefault()

    const {
      activeRoom,
      changeActiveRoom,
      toggleInstantMode,
      showChatbar,
      rooms
    } = this.props

    // toggle chatroom display
    toggleInstantMode()

    if (showChatbar) {
      // display first room if there is no active room
      if (!activeRoom) {
        if (Object.keys(rooms)[0]) {
          let firstRoomId = rooms[Object.keys(rooms)[0]].id

          changeActiveRoom(firstRoomId)
        }

        showChatbar && this.props.toggleChatbar(false)
      }
    }
  }

  /**
   * create room's avatar image
   */
  getRoomAvatar(room) {
    const { user, activeRoom } = this.props
    const size = 20
    const color = 'rgba(216, 216, 216, 0.3)'
    const textSizeRatio = 2.5
    const fgColor = '#263445'

    if (room.room_type === 'Group') {
      return <UserAvatar
        name={room.users.length.toString()}
        size={size}
        showStateIndicator={false}
        color={color}
        textSizeRatio={textSizeRatio}
        fgColor={fgColor}
      />
    }

    // get partner data
    const User = room.users.length > 1
      ? _.find(room.users, u => u.id !== user.id)
      : room.users[0]

    return <UserAvatar
      userId={User.id}
      name={User.display_name}
      image={User.profile_image_url}
      size={size}
      color={color}
      borderColor={room.id === activeRoom ? '#2196f3' : '#303E4D'}
      textSizeRatio={textSizeRatio}
      fgColor={fgColor}
    />
  }

  /**
   * get room title, trim long titles
   */
  getRoomTitle(title) {
    const len = 27

    if (title.length <= len) {
      return title
    }

    return `${title.substr(0, len)}...`
  }

  render() {
    const { filter } = this.state
    const {
      showChatbar, instantMode, rooms, activeRoom
    } = this.props

    return (
      <div className="rooms">
        <div className="toolbar">

          <SearchInput
            onChange={filter => this.onChangeFilter(filter)}
            style={{ width: showChatbar ? 190 : 240 }}
          />

          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="popover-leave">Close chat panel</Tooltip>}
          >
            <div
              className="toggle-sidebar"
            >
              <button
                onClick={() => {
                  instantMode && this.props.toggleInstantMode()
                  showChatbar && this.props.toggleChatbar(false)
                }}
                className="c-button--shadow btn-tgl"
              >
                <i className="fa fa-angle-double-left fa-2x" />
              </button>
            </div>
          </OverlayTrigger>

          {
            showChatbar &&
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="popover-leave">Expand Fullscreen</Tooltip>}
            >
              <div
                className="toggle-sidebar two-direction-arrow-container"
              >
                <button
                  onClick={e => this.fullScreen(e)}
                  className="c-button--shadow btn-tgl"
                >
                  <TwoDirectionArrow className="two-direction-arrow" />
                </button>
              </div>
            </OverlayTrigger>
          }

          <SocketStatus />
        </div>

        <div className="list-container">
          <div className="list">
            {
              _.chain(rooms)
                .filter(room => ['Direct', 'Group'].indexOf(room.room_type) > -1)
                .filter(room =>
                  room.proposed_title && room
                    .proposed_title
                    .toLowerCase()
                    .includes(filter.toLowerCase()))
                .sortBy(room => room.updated_at * -1)
                .map(room =>
                  <Row
                    onClick={() => this.props.onSelectRoom(room.id)}
                    key={`ROOM_CHANNEL_${room.id}`}
                    className={cn('item', { active: room.id === activeRoom })}
                  >
                    <Col sm={1} xs={1} className="avatar vcenter">
                      {this.getRoomAvatar(room)}
                    </Col>
                    <Col
                      sm={9}
                      xs={9}
                      className={cn(
'title vcenter',
                        { hasNotification: room.new_notifications > 0 }
                      )}
                    >
                      <span>
                        {this.getRoomTitle(room.proposed_title)}
                      </span>
                      <UserTyping roomId={room.id} />
                    </Col>

                    <Col sm={1} xs={1} className="notifications vcenter">
                      {
                        room.new_notifications > 0 &&
                        <span className="count">
                          {room.new_notifications}
                        </span>
                      }
                    </Col>
                  </Row>)
                .value()
            }
          </div>
        </div>

        <CreateRoom />
      </div>
    )
  }
}

function mapStateToProps({ chatroom }) {
  return {
    instantMode: chatroom.instantMode,
    showChatbar: chatroom.showChatbar,
    rooms: chatroom.rooms
  }
}

export default connect(
  mapStateToProps,
  { toggleInstantMode, changeActiveRoom, toggleChatbar }
)(Rooms)

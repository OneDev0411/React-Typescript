import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import S from 'shorti'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import helpers from '../../../../../utils/helpers'
import UserAvatar from '../../../../Partials/UserAvatar'

const DeliveryReport = ({
  room,
  user,
  author,
  message
}) => {

  let delivery_notification
  let show_double_check = false

  if (author && author.id === user.id) {
    let deliveries = _.uniqBy(message.deliveries, dlvr => dlvr.user)

    if (message.acked_by)
      deliveries = _.filter(deliveries, dlvr => message.acked_by.indexOf(dlvr.user) === -1)

    if (deliveries.length > 0 || message.acked_by)
      show_double_check = true

    // blue double check means at least one person has read the message.
    const double_check_color = message.acked_by && message.acked_by.length > 0 ? '2196f3' : 'c3c3c3'
    const double_check = (
      <span style={S(`color-${double_check_color} ml-5`)}>
        <i className="fa fa-check" style={S('font-12')} />
        <i className="fa fa-check" style={S('font-12 ml-1n')} />
      </span>
    )
    const message_info_dialog = (
      <Popover id="popover-message-info" title="Message Info"
        style={{ width: '400px' }}
      >
        {
          message.acked_by &&
          <div className="content read-by">
            <div className="title">
              <span style={S('color-2196f3')}>
                <i className="fa fa-check" style={S('font-12')} />
                <i className="fa fa-check" style={S('font-12 mr-5 ml-1n')} />
              </span>
              READ BY
            </div>
            <div className="report">
              {
                _.uniq(message.acked_by)
                .map((id) => {
                  const user_info = _.find(room.users, { id })
                  if (!user_info) return <div />
                  return (
                    <div className="item" key={id}>
                      <div style={{ display: 'inline' }}>
                        <UserAvatar size={30} name="" showStateIndicator={false} />
                      </div>
                      <div className="name">{ user_info.display_name }</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        }

        {
          deliveries.length > 0 &&
          <div className="content delivered-to">
            <div className="title">
              <span style={S('color-c3c3c3')}>
                <i className="fa fa-check" style={S('font-12')} />
                <i className="fa fa-check" style={S('font-12 mr-5 ml-1n')} />
              </span>
              DELIVERED TO
            </div>
            <div className="report">
              {
                deliveries
                .map((dlvr) => {
                  const user_info = _.find(room.users, { id: dlvr.user })

                  if (!user_info) return <div />
                  const user_info_date = helpers.friendlyDate(user_info.created_at)
                  return (
                    <div className="item" key={`item${dlvr.id}`}>
                      <div style={{ display: 'inline' }}>
                        <UserAvatar size={30} name="" showStateIndicator={false} />
                      </div>
                      <div className="name">{ user_info.display_name }</div>
                      <div className="time">
                        <span style={S('color-9b9b9b mr-6')} >{ user_info_date.day}</span>{ user_info_date.time_friendly }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        }
      </Popover>
    )

    delivery_notification = (
      <span>
        {
          (message.acked_by || message.deliveries) &&
          <OverlayTrigger trigger="click" rootClose placement="right" overlay={message_info_dialog}>
            { double_check }
          </OverlayTrigger>
        }
      </span>
    )
  }

  return (
    <div style={{ display: 'inline' }}>
      { delivery_notification }
    </div>
  )
}

function mapStateToProps(state, ownProps) {
  return {
    room: state.chatroom.rooms[ownProps.message.room]
  }
}

export default connect(mapStateToProps)(DeliveryReport)

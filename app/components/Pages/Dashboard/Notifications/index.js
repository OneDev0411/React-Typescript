import React, { Component } from 'react'
import { connect } from 'react-redux'
import S from 'shorti'
import { getTimeAgo } from '../../../../utils/helpers'
import { browserHistory } from 'react-router'
import Header from './Header'
import {
  selectNotifications,
  selectNotificationIsFetching
} from '../../../../reducers/notifications'
import {
  deleteNewNotifications,
  markNotificationAsSeen
} from '../../../../store_actions/notifications'

class Notifications extends Component {
  componentDidMount() {
    const { deleteNewNotifications } = this.props

    deleteNewNotifications()
  }
  handleNotifClick(notification) {
    const { markNotificationAsSeen } = this.props

    markNotificationAsSeen(notification.id)

    switch (notification.notification_type) {
      case 'DealRoleReactedToEnvelope':
        browserHistory.push(`/dashboard/deals/${notification.objects[0].deal}`)
        break
      case 'UserReactedToEnvelope':
        browserHistory.push(`/dashboard/deals/${notification.objects[0].deal}`)
        break

      case 'ListingPriceDroppedUser':
        browserHistory.push(`/dashboard/mls/${notification.subjects[0].id}`)
        break
      case 'ListingStatusChangedUser':
        browserHistory.push(`/dashboard/mls/${notification.subjects[0].id}`)
        break
      case 'ListingBecameAvailableUser':
        browserHistory.push(`/dashboard/mls/${notification.subjects[0].id}`)
        break
      case 'OpenHouseAvailableListing':
        browserHistory.push(`/dashboard/mls/${notification.objects[0].id}`)
        break

      case 'CrmTaskIsDueCrmTask':
        browserHistory.push(`/crm/tasks/${notification.object}`)
        break
      case 'ReminderIsDueCrmTask':
        browserHistory.push(`/crm/tasks/${notification.object}`)
        break

      default:
        break
    }
  }
  notificationIcon(notification) {
    const type = notification.notification_type
    const subject = notification.subjects[0]
    let object

    if (notification.objects) {
      object = notification.objects[0]
    }

    let icon
    const common_image_style =
      'bg-center bg-cover w-50 h-50 absolute br-100 t-15'

    switch (type) {
      case 'UserSentMessage':
        icon = (
          <div>
            <div
              style={S(
                `${
                  subject.profile_image_url
                    ? `bg-url(${subject.profile_image_url})`
                    : 'bg-ccc'
                } ${common_image_style}`
              )}
            >
              {!subject.profile_image_url && (
                <div style={S('color-fff text-center font-10 mt-10')}>
                  No <br />image
                </div>
              )}
            </div>
          </div>
        )
        break
      case 'UserEditedAlert':
        icon = (
          <div>
            <div
              style={S(
                `bg-url(${subject.profile_image_url}) ${common_image_style}`
              )}
            />
          </div>
        )
        break
      case 'UserCreatedAlert':
        icon = (
          <div>
            <div
              style={S(
                `bg-url(${subject.profile_image_url}) ${common_image_style}`
              )}
            />
          </div>
        )
        break
      case 'UserSharedListing':
        icon = (
          <div>
            <div
              style={S(
                `bg-url(${object.cover_image_url}) ${common_image_style}`
              )}
            />
          </div>
        )
        break
      case 'UserInvitedRoom':
        icon = (
          <div>
            <div
              style={S(
                `bg-url(${subject.profile_image_url}) ${common_image_style}`
              )}
            />
          </div>
        )
        break
      case 'ListingBecameAvailableUser':
        icon = (
          <div>
            <div
              style={S(
                `${
                  subject.cover_image_url
                    ? `bg-url(${subject.cover_image_url})`
                    : 'bg-ccc'
                } ${common_image_style}`
              )}
            >
              {!subject.cover_image_url && (
                <div style={S('color-fff text-center font-10 mt-10')}>
                  No <br />image
                </div>
              )}
            </div>
          </div>
        )
        break
      case 'ListingPriceDroppedUser':
        icon = (
          <div>
            <div
              style={S(
                `${
                  subject.cover_image_url
                    ? `bg-url(${subject.cover_image_url})`
                    : 'bg-ccc'
                } ${common_image_style}`
              )}
            >
              {!subject.cover_image_url && (
                <div style={S('color-fff text-center font-10 mt-10')}>
                  No <br />image
                </div>
              )}
            </div>
          </div>
        )
        break
      case 'ListingStatusChangedUser':
        icon = (
          <div>
            <div
              style={S(
                `${
                  subject.cover_image_url
                    ? `bg-url(${subject.cover_image_url})`
                    : 'bg-ccc'
                } ${common_image_style}`
              )}
            >
              {!subject.cover_image_url && (
                <div style={S('color-fff text-center font-10 mt-10')}>
                  No <br />image
                </div>
              )}
            </div>
          </div>
        )
        break
      case 'OpenHouseAvailableListing':
        icon = (
          <div>
            <div
              style={S(
                `bg-url(${object.cover_image_url}) ${common_image_style}`
              )}
            />
          </div>
        )
        break
      case 'UserJoinedRoom':
        icon = (
          <div>
            <div
              style={S(
                `bg-url(${subject.profile_image_url}) ${common_image_style}`
              )}
            />
          </div>
        )
        break
      case 'DealRoleReactedToEnvelope':
        icon = (
          <div>
            <div
              style={S(
                `bg-url(${subject.profile_image_url}) ${common_image_style}`
              )}
            />
          </div>
        )
        break
      default:
        icon = <div />
    }

    return icon
  }
  getNotifications() {
    const { notifications, isFetching } = this.props

    if (notifications && notifications.length) {
      return notifications.map((notification, i) => {
        let bg_color = 'rgba(32, 150, 243, 0.05)'

        if (notification.seen) {
          bg_color = '#ffffff'
        }

        if (notification.notification_type === 'ContactCreatedForUser') {
          return
        }

        return (
          <div
            onClick={this.handleNotifClick.bind(this, notification)}
            key={notification.id + i}
            className="clearfix"
            style={{
              ...S('h-80 p-20 pointer relative'),
              backgroundColor: bg_color,
              boxShadow: '0 1px 0 0 #f1f1f1'
            }}
          >
            {this.notificationIcon(notification)}
            <div style={S('relative ml-70')}>
              <div style={S('color-263445 font-17')}>
                {notification.message}
              </div>
              <div style={S('color-c6c6c6')}>
                {getTimeAgo(notification.created_at)} ago
              </div>
            </div>
          </div>
        )
      })
    }

    if (notifications.length === 0 && !isFetching) {
      return <div style={S('text-center mt-40')}>No Notifications Yet</div>
    }

    return <div style={S('text-center mt-40')}>Loading...</div>
  }
  render() {
    return (
      <div
        style={{
          boxShadow:
            '-1px 0 2px 0 rgba(0,0,0,0.04), -1px 0 20px 0 rgba(0,0,0,0.1)'
        }}
      >
        <Header />
        <div style={{ position: 'relative', height: '100vh' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%'
            }}
          >
            {this.getNotifications()}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  ({ globalNotifications }) => ({
    notifications: selectNotifications(globalNotifications),
    isFetching: selectNotificationIsFetching(globalNotifications)
  }),
  { deleteNewNotifications, markNotificationAsSeen }
)(Notifications)

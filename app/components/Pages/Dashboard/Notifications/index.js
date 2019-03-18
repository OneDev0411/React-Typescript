import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import S from 'shorti'
import timeago from 'timeago.js'
import { Helmet } from 'react-helmet'

import { selectNotificationNewCount } from '../../../../reducers/notifications'

import {
  selectNotifications,
  selectNotificationIsFetching
} from '../../../../reducers/notifications'
import {
  deleteNewNotifications,
  markNotificationAsSeen
} from '../../../../store_actions/notifications'

import Header from './Header'
import { CrmEvents } from './CrmEvents'

class Notifications extends Component {
  constructor(props) {
    super(props)

    const { params } = props

    this.state = {
      selectedEvent: (params.type && params.type === 'crm' && params.id) || null
    }
  }

  componentDidMount() {
    const { deleteNewNotifications } = this.props

    deleteNewNotifications()
  }

  get documentTitle() {
    const { unreadNotificationsCount } = this.props
    const counter =
      unreadNotificationsCount > 0 ? `: ${unreadNotificationsCount} unread` : ''

    return `Notifications${counter} | Rechat`
  }

  openCRMTaskDrawer = selectedEvent => {
    this.setState(
      { selectedEvent },
      browserHistory.push(`/dashboard/notifications/crm/${selectedEvent.id}`)
    )
  }

  closeCRMTaskDrawer = () => {
    this.setState({ selectedEvent: null }, () =>
      browserHistory.push('/dashboard/notifications')
    )
  }

  handleNotifClick = notification => {
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
      case 'ContactAttributeIsDueContact':
        browserHistory.push(`/dashboard/contacts/${notification.objects[0].id}`)
        break
      case 'DealContextIsDueDeal':
        browserHistory.push(`/dashboard/deals/${notification.objects[0].id}`)
        break

      case 'CrmTaskIsDueCrmTask':
      case 'ReminderIsDueCrmTask':
      case 'UserAssignedCrmTask':
      case 'UserEditedCrmTask':
        this.openCRMTaskDrawer(notification.objects[0])
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
                    : 'bg-000'
                } ${common_image_style}`
              )}
            >
              {!subject.profile_image_url && (
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '10px',
                    marginTop: '10px',
                    textAlign: 'center',
                    fontWeight: '700'
                  }}
                >
                  No <br />
                  image
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
                    : 'bg-000'
                } ${common_image_style}`
              )}
            >
              {!subject.cover_image_url && (
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '10px',
                    marginTop: '10px',
                    textAlign: 'center',
                    fontWeight: '700'
                  }}
                >
                  No <br />
                  image
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
                    : 'bg-000'
                } ${common_image_style}`
              )}
            >
              {!subject.cover_image_url && (
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '10px',
                    marginTop: '10px',
                    textAlign: 'center',
                    fontWeight: '700'
                  }}
                >
                  No <br />
                  image
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
                    : 'bg-000'
                } ${common_image_style}`
              )}
            >
              {!subject.cover_image_url && (
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '10px',
                    marginTop: '10px',
                    textAlign: 'center',
                    fontWeight: '700'
                  }}
                >
                  No <br />
                  image
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
              ...S('h-80 p-24 pointer relative'),
              backgroundColor: bg_color,
              padding: '1em',
              margin: '0 1.5em',
              borderBottom: '1px solid #d4d4d4'
            }}
          >
            {this.notificationIcon(notification)}
            <div style={{ position: 'relative', marginLeft: '4rem' }}>
              <div style={S('color-263445')}>{notification.message}</div>
              <div style={S('color-c6c6c6')}>
                {timeago().format(notification.created_at * 1000)}
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
          height: '100vh',
          overflowY: 'scroll'
        }}
      >
        <Helmet>
          <title>{this.documentTitle}</title>
        </Helmet>
        <Header />
        {this.getNotifications()}
        {this.state.selectedEvent && (
          <CrmEvents
            isOpen
            deleteCallback={this.closeCRMTaskDrawer}
            onClose={this.closeCRMTaskDrawer}
            selectedEvent={this.state.selectedEvent}
            submitCallback={this.closeCRMTaskDrawer}
            user={this.props.user}
          />
        )}
      </div>
    )
  }
}

export default withRouter(
  connect(
    ({ user, globalNotifications }) => ({
      user,
      isFetching: selectNotificationIsFetching(globalNotifications),
      notifications: selectNotifications(globalNotifications),
      unreadNotificationsCount: selectNotificationNewCount(globalNotifications)
    }),
    { deleteNewNotifications, markNotificationAsSeen }
  )(Notifications)
)

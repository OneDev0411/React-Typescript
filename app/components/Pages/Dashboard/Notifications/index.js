import React  from 'react'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'
import NotificationDispatcher from '../../../../dispatcher/NotificationDispatcher'
import S  from 'shorti'
export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { data } = this.props
    const { user } = data
    // get notification
    NotificationDispatcher.dispatch({
      action: 'get-all',
      user
    })
  }
  notificationIcon(type) {
    let icon
    switch (type) {
      case 'UserSentMessage':
        icon = <div><i className="fa fa-comment text-primary"></i> User Sent Message</div>
        break
      case 'UserEditedAlert':
        icon = <div>UserEditedAlert</div>
        break
      case 'UserCreatedAlert':
        icon = <div>UserCreatedAlert</div>
        break
      case 'UserSharedListing':
        icon = <div><i className="fa fa-share text-primary"></i>  UserSharedListing</div>
        break
      case 'UserInvitedRoom':
        icon = <div><i className="fa fa-envelope text-primary"></i> UserInvitedRoom</div>
        break
      case 'ListingBecameAvailableRoom':
        icon = <div>ListingBecameAvailableRoom</div>
        break
      case 'ListingPriceDroppedUser':
        icon = <div><i className="fa fa-arrow-down text-primary"></i> ListingPriceDroppedUser</div>
        break
      case 'ListingStatusChangedUser':
        icon = <div>ListingStatusChangedUser</div>
        break
      case 'OpenHouseAvailableListing':
        icon = <div>OpenHouseAvailableListing</div>
        break
      case 'UserJoinedRoom':
        icon = <div>UserJoinedRoom</div>
        break
      case 'ContactCreatedForUser':
        icon = <div><i className="fa fa-user text-primary"></i> ContactCreatedForUser</div>
        break
      case 'UserReactedToEnvelope':
        icon = <div>UserReactedToEnvelope</div>
        break
      default:
        icon = <div>default</div>
    }
    return icon
  }
  getNotifications() {
    const { data } = this.props
    const { notifications } = data
    if (notifications) {
      return notifications.map(notification => {
        console.log(notification)
        return (
          <div key={ notification.id } style={ { ...S('h-80 p-20 pointer w-100p'), boxShadow: '0 1px 0 0 #f1f1f1' } }>
            <div style={ S('pull-left mr-20') }>{ this.notificationIcon(notification.notification_type) }</div>
            <div style={ S('pull-left') }>{ notification.message }</div>
          </div>
        )
      })
    }
  }
  render() {
    const { data } = this.props
    let nav_area = (
      <SideBar data={ data }/>
    )
    if (data.is_mobile && user) {
      nav_area = (
        <MobileNav data={ data }/>
      )
    }
    const user = data.user
    const title_style = {
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      ...S('w-100p pl-20 pb-20 font-21')
    }
    return (
      <main>
        { nav_area }
        <div style={ S('absolute l-70 w-100p') }>
          <h1 style={ title_style }>Notifications</h1>
          <div style={ S('w-100p') }>
            { this.getNotifications() }
          </div>
        </div>
      </main>
    )
  }
}

import React  from 'react'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'
import NotificationDispatcher from '../../../../dispatcher/NotificationDispatcher'
import S  from 'shorti'
import helpers from '../../../../utils/helpers'
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
  notificationIcon(notification) {
    const type = notification.notification_type
    const subject = notification.subjects[0]
    let object
    if (notification.objects)
      object = notification.objects[0]
    let icon
    switch (type) {
      case 'UserSentMessage':
        icon = <div><div style={ S(`${subject.profile_image_url ? `bg-url(${subject.profile_image_url})` : 'bg-ccc'} bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }>{ !subject.profile_image_url && <div style={ S('color-fff text-center font-10 mt-10') }>No <br />image</div> }</div></div>
        break
      case 'UserEditedAlert':
        icon = <div><div style={ S(`bg-url(${subject.profile_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'UserCreatedAlert':
        icon = <div><div style={ S(`bg-url(${subject.profile_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'UserSharedListing':
        icon = <div><div style={ S(`bg-url(${object.cover_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'UserInvitedRoom':
        icon = <div><div style={ S(`bg-url(${subject.profile_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'ListingBecameAvailableRoom':
        icon = <div><div style={ S(`bg-url(${object.cover_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'ListingPriceDroppedUser':
        icon = <div><div style={ S(`bg-url(${object.cover_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'ListingStatusChangedUser':
        icon = <div><div style={ S(`bg-url(${object.cover_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'OpenHouseAvailableListing':
        icon = <div><div style={ S(`bg-url(${object.cover_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'UserJoinedRoom':
        icon = <div><div style={ S(`bg-url(${subject.profile_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      case 'ContactCreatedForUser':
        icon = <div><div style={ S(`${subject.profile_image_url ? `bg-url(${subject.profile_image_url})` : 'bg-ccc'} bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }>{ !subject.profile_image_url && <div style={ S('color-fff text-center font-10 mt-10') }>No <br />image</div> }</div></div>
        break
      case 'UserReactedToEnvelope':
        icon = <div><div style={ S(`bg-url(${subject.profile_image_url}) bg-center bg-cover w-50 h-50 absolute br-100 t-10`) }/></div>
        break
      default:
        icon = <div></div>
    }
    return icon
  }
  getNotifications() {
    const { data } = this.props
    const { notifications } = data
    if (notifications && notifications.length) {
      return notifications.map((notification, i) => {
        // console.log(notification)
        return (
          <div key={ notification.id + i } style={ { ...S('h-80 p-20 pointer w-100p relative'), boxShadow: '0 1px 0 0 #f1f1f1' } }>
            <div style={ S('pull-left') }>{ this.notificationIcon(notification) }</div>
            <div style={ S('pull-left relative l-80 w-100p') }>
              <div style={ S('color-263445 font-17') }>{ notification.message }</div>
              <div style={ S('color-c6c6c6') }>{ helpers.getTimeAgo(notification.created_at) } ago</div>
            </div>
          </div>
        )
      })
    }
    return <div style={ S('text-center mt-40') }>Loading...</div>
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

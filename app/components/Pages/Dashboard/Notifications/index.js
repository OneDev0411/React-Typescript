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
  getNotifications() {
    const { data } = this.props
    const { notifications } = data
    if (notifications) {
      return notifications.map(notification => {
        console.log(notification)
        return (
          <div key={ notification.id } style={ { ...S('h-80 p-20'), boxShadow: '0 1px 0 0 #f1f1f1' } }>
            <div>{ notification.message }</div>
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

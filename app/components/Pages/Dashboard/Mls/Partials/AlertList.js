// Partials/AlertList.js
import React, { Component } from 'react'
// import { FormControl } from 'react-bootstrap'
import S from 'shorti'
import controller from '../../controller'
import Loading from '../../../../Partials/Loading'
export default class AlertList extends Component {
  truncateTitle(title) {
    if (title.length > 35)
      return `${title.substring(0, 35)}...`
    return title
  }
  alertHasNotifications(alert_id) {
    let result = false
    const data = this.props.data
    if (!data.notifications)
      return false
    const summaries = data.notifications.summary.room_notification_summaries
    if (!summaries)
      return false
    summaries.forEach((summary) => {
      const user_created_alert_ids = summary.user_created_alert_ids
      if (user_created_alert_ids && user_created_alert_ids.indexOf(alert_id) !== -1)
        result = true
    })
    return result
  }
  getThumb(alert) {
    // Listing Thumb
    let listing_thumb = <div style={ S(`bg-url(http://cdn.rechat.co/59563879.jpg) bg-cover bg-center w-54 h-54 pull-left mr-15`) }/>
    if (alert.cover_image_url) {
      listing_thumb = <div style={ S(`bg-url(${alert.cover_image_url}) bg-cover bg-center w-54 h-54 pull-left mr-15`) }/>
    }
    return listing_thumb
  }
  getBadge(new_recommendations) {
    // Badge
    let new_badge
    if (new_recommendations) {
      new_badge = (
        <div style={ S('absolute w-100p h-100p t-0 l-0') }>
          <div style={ S('absolute t-30 r-20 bg-2196f3 br-100 color-fff w-26 h-26 text-center pt-4') }>
            { new_recommendations }
          </div>
        </div>
      )
    }
    return new_badge
  }
  render() {
    const data = this.props.data
    const user = data.user
    const alerts = data.alerts
    const current_alert = data.current_alert
    let alerts_list_area = <Loading />
    const alert_list_style = {
      ...S(`m-0 p-0 h-${window.innerHeight - 66}`),
      overflowY: 'scroll'
    }
    if (alerts) {
      alerts_list_area = (
        <ul style={alert_list_style}>
          {
            alerts.map((alert) => {
              if (!alert.title && !alert.proposed_title)
                return <li />
              const users = alert.users
              let users_area
              if (users && users.length)
                users_area = users.map(user_shared => <span key={`alert-user-${user_shared.id}`}>{ user_shared.first_name }, </span>)

              // Notifications
              let notification
              let has_notification
              if (data.notifications) {
                has_notification = this.alertHasNotifications(alert.id)
                if (has_notification) {
                  notification = (
                    <div style={S('absolute t-35 r-20 w-0 h-0')}>
                      <i className="fa fa-circle" style={S('font-8 color-3388FF z-10')} />
                    </div>
                  )
                }
              }
              return (
                <li key={`alert-list-${alert.id}`} style={S(`relative h-100 border-bottom-1-solid-dedede p-20 pointer${current_alert && current_alert.id === alert.id ? ' bg-f7f7f7' : ''}`)} onClick={controller.alert_map.showAlertOnMap.bind(this, alert)}>
                  { this.getThumb(alert) }
                  <div style={S(`font-18${has_notification ? ' fw-500' : ''}`)}>{ this.truncateTitle(alert.title ? alert.title : alert.proposed_title) }</div>
                  { notification }
                  <div style={S(`font-14${has_notification ? ' fw-500' : ' color-9b9b9b'}`)}>Shared with: { users_area }</div>
                  {
                    /*
                    <div>
                      <img style={ S('w-23 h-13 mr-5') }src="/static/images/dashboard/mls/eye.svg"/>
                      <span style={ S('color-c3c3c3 font-16 mr-15 t-1 relative') }>8</span>
                      <img style={ S('w-23 h-13 mr-5') }src="/static/images/dashboard/mls/heart.svg"/>
                      <span style={ S('color-c3c3c3 font-16 mr-20 t-1 relative') }>3</span>
                      <img style={ S('w-14 h-13 mr-5') }src="/static/images/dashboard/mls/comment.svg"/>
                      <span style={ S('color-c3c3c3 font-16 t-1 relative') }>1</span>
                    </div>
                    */
                  }
                  { this.getBadge(alert.new_recommendations) }
                </li>
              )
            })
          }
        </ul>
      )
      if (!alerts.length) {
        alerts_list_area = (
          <div style={S('p-15')}>No { user.user_type === 'Agent' ? 'alerts' : 'saved searches' } yet.</div>
        )
      }
    }
    const drawer_style = S(`bg-fff w-350 h-${window.innerHeight - 66} absolute z-1 t-66 l-0 border-right-1-solid-d3d3d3`)
    return (
      <div className="alert-list" style={drawer_style}>
        {
          /*
          <div style={ S('p-10 pb-0') }>
            <img style={ S('absolute r-22 t-22 w-20') } src="/static/images/dashboard/mls/search.svg" />
            <FormControl type="text" bsSize="large" placeholder="Search Alerts" />
          </div>
          */
        }
        { alerts_list_area }
      </div>
    )
  }
}
AlertList.propTypes = {
  data: React.PropTypes.object
}

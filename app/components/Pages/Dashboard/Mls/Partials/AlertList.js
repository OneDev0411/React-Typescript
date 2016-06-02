// Partials/AlertList.js
import React, { Component } from 'react'
import { Input } from 'react-bootstrap'
import S from 'shorti'
import controller from '../../controller'
export default class AlertList extends Component {
  render() {
    const data = this.props.data
    const alerts = data.alerts
    const current_alert = data.current_alert
    let alerts_list_area
    if (alerts) {
      alerts_list_area = (
        <ul style={ S('m-0 p-0') }>
          {
            alerts.map(alert => {
              const users = alert.users
              let users_area
              if (users && users.length) {
                users_area = users.map(user => {
                  return <span>{ user.first_name }, </span>
                })
              }
              return (
                <li key={ 'alert-' + alert.id } style={ S('h-100 border-bottom-1-solid-dedede p-20 pointer' + (current_alert && current_alert.id === alert.id ? ' bg-f7f7f7' : '')) } onClick={ controller.alert_map.showAlertOnMap.bind(this, alert) }>
                  <div style={ S('font-18 fw-500') }>{ alert.title }</div>
                  <div style={ S('font-14 fw-500') }>Shared with: { users_area }</div>
                  <div>
                    <img style={ S('w-23 h-13 mr-5') }src="/images/dashboard/mls/eye.svg"/>
                    <span style={ S('color-c3c3c3 font-16 mr-15 t-1 relative') }>8</span>
                    <img style={ S('w-23 h-13 mr-5') }src="/images/dashboard/mls/heart.svg"/>
                    <span style={ S('color-c3c3c3 font-16 mr-20 t-1 relative') }>3</span>
                    <img style={ S('w-14 h-13 mr-5') }src="/images/dashboard/mls/comment.svg"/>
                    <span style={ S('color-c3c3c3 font-16 t-1 relative') }>1</span>
                  </div>
                </li>
              )
            })
          }
        </ul>
      )
    }
    const drawer_style = S(`bg-fff w-350 h-${window.innerHeight - 66} absolute z-1 t-66 l-0`)
    return (
      <div className="alert-list" style={ drawer_style }>
        <div style={ S('p-10') }>
          <Input type="text" bsSize="large" placeholder="Search Alerts" />
        </div>
        { alerts_list_area }
      </div>
    )
  }
}
AlertList.propTypes = {
  data: React.PropTypes.object
}
// Partials/AlertList.js
import React, { Component } from 'react'
// import { Input } from 'react-bootstrap'
import S from 'shorti'
import controller from '../../controller'
import listing_util from '../../../../../utils/listing'
import Loading from '../../../../Partials/Loading'
export default class AlertList extends Component {
  truncateTitle(title) {
    if (title.length > 35)
      return title.substring(0, 35) + '...'
    return title
  }
  render() {
    const data = this.props.data
    const alerts = data.alerts
    const current_alert = data.current_alert
    let alerts_list_area = <Loading />
    const alert_list_style = {
      ...S(`m-0 p-0 h-${window.innerHeight - 66}`),
      overflowY: 'scroll'
    }
    if (alerts) {
      alerts_list_area = (
        <ul style={ alert_list_style }>
          {
            alerts.map(alert => {
              const users = alert.users
              let users_area
              if (users && users.length) {
                users_area = users.map(user => {
                  return <span key={ 'alert-user-' + user.id }>{ user.first_name }, </span>
                })
              }
              return (
                <li key={ 'alert-list-' + alert.id } style={ S('h-100 border-bottom-1-solid-dedede p-20 pointer' + (current_alert && current_alert.id === alert.id ? ' bg-f7f7f7' : '')) } onClick={ controller.alert_map.showAlertOnMap.bind(this, alert) }>
                  <div style={ S('font-18 fw-500') }>{ this.truncateTitle(alert.title ? alert.title : listing_util.alertOptionsShort(alert)) }</div>
                  <div style={ S('font-14 fw-500') }>Shared with: { users_area }</div>
                  {
                    /*
                    <div>
                      <img style={ S('w-23 h-13 mr-5') }src="/images/dashboard/mls/eye.svg"/>
                      <span style={ S('color-c3c3c3 font-16 mr-15 t-1 relative') }>8</span>
                      <img style={ S('w-23 h-13 mr-5') }src="/images/dashboard/mls/heart.svg"/>
                      <span style={ S('color-c3c3c3 font-16 mr-20 t-1 relative') }>3</span>
                      <img style={ S('w-14 h-13 mr-5') }src="/images/dashboard/mls/comment.svg"/>
                      <span style={ S('color-c3c3c3 font-16 t-1 relative') }>1</span>
                    </div>
                    */
                  }
                </li>
              )
            })
          }
        </ul>
      )
      if (!alerts.length) {
        alerts_list_area = (
          <div style={ S('p-15') }>No alerts yet</div>
        )
      }
    }
    const drawer_style = S(`bg-fff w-350 h-${window.innerHeight - 66} absolute z-1 t-66 l-0 border-right-1-solid-d3d3d3`)
    return (
      <div className="alert-list" style={ drawer_style }>
        {
          /*
          <div style={ S('p-10 pb-0') }>
            <img style={ S('absolute r-22 t-22 w-20') } src="/images/dashboard/mls/search.svg" />
            <Input type="text" bsSize="large" placeholder="Search Alerts" />
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
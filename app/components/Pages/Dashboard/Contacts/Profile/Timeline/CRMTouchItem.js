import React from 'react'
import timeago from 'timeago.js'

import Icon from '../../../../../../views/components/SvgIcons/AddAlarm/IconAddAlarm'
import { goTo } from '../../../../../../utils/go-to'

export class CRMTouchItem extends React.Component {
  onClick = () =>
    goTo(
      `/crm/touches/${this.props.touch.id}`,
      `Contact - ${this.props.contact.display_name}`
    )

  render() {
    const { touch } = this.props

    return (
      <a className="c-contact-activities-list__item" onClick={this.onClick}>
        <div className="image">
          <Icon style={{ width: 32, height: 32, fill: '#8da2b5' }} />
        </div>

        <div className="info">
          <div className="desc" style={{ marginBottom: '.5em' }}>
            {touch.activity_type}
          </div>

          <div className="time">
            <img src="/static/images/contacts/alert-fill@3x.png" alt="alert" />
            {timeago().format(touch.timestamp * 1000)}
          </div>
        </div>
      </a>
    )
  }
}

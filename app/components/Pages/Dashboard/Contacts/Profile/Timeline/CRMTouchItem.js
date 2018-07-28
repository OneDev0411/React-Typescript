import React from 'react'
import timeago from 'timeago.js'

import Icon from '../../../../../../views/components/SvgIcons/AddAlarm/IconAddAlarm'
import { goTo } from '../../../../../../utils/go-to'

export function CRMTouchItem(props) {
  const { touch } = props

  const activity = (
    <React.Fragment>
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
    </React.Fragment>
  )

  return (
    <a
      className="c-contact-activities-list__item"
      onClick={() =>
        goTo(
          `/crm/touches/${touch.id}`,
          `Contact - ${props.contact.display_name}`
        )
      }
    >
      {activity}
    </a>
  )
}

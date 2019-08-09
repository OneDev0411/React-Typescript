import React from 'react'
import fecha from 'fecha'

import IconCalendar from 'components/SvgIcons/Calendar2/IconCalendar'
import { RelativeTime } from 'components/RelativeTime'

import { ProfileDateType } from './types'

interface ActivityPropsType {
  dates?: ProfileDateType[]
  last_touch?: number
}

function Activity(props: ActivityPropsType) {
  if (!props.dates || props.dates.length == 0) {
    return null
  }

  return (
    <div className="activity">
      <ul>
        {props.last_touch && (
          <li>
            <div className="icon">
              <IconCalendar style={{ width: '1em', height: '1em' }} />
            </div>
            <div className="text">
              Last Touched <RelativeTime time={props.last_touch * 1000} />
            </div>
          </li>
        )}
        {props.dates.map((item, i) => {
          return (
            <li key={i}>
              <div className="icon">
                <IconCalendar style={{ width: '1em', height: '1em' }} />
              </div>
              <div className="text">
                {`${item.title} ${fecha.format(
                  new Date(item.date * 1000),
                  'mediumDate'
                )}`}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Activity

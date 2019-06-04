import React from 'react'
import fecha from 'fecha'

import IconCalendar from 'components/SvgIcons/Calendar2/IconCalendar'

import { ProfileDateType } from './useProfile'

interface ActivityPropsType {
  dates?: ProfileDateType[]
}

function Activity(props: ActivityPropsType) {
  if (!props.dates || props.dates.length == 0) {
    return null
  }

  return (
    <div className="activity">
      <ul>
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

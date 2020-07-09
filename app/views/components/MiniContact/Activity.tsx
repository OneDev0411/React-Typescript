import React from 'react'
// import { Button } from '@material-ui/core'

// import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import { mdiClockOutline, mdiGiftOutline, mdiCalendarOutline } from '@mdi/js'

import { useTheme } from '@material-ui/core'

import { RelativeTime } from 'components/RelativeTime'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ProfileDateType } from './types'
import { activitiesFormatter, formatDate } from './helpers'

interface ActivityPropsType {
  dates?: ProfileDateType[]
  last_touch?: number
  contactId?: string
}

function Activity(props: ActivityPropsType) {
  const theme = useTheme()

  if ((!props.dates || props.dates.length == 0) && !props.last_touch) {
    return null
  }

  return (
    <div className="activity">
      <ul>
        {props.last_touch && (
          <li>
            <div className="icon">
              <SvgIcon path={mdiClockOutline} size={muiIconSizes.small} />
            </div>
            <div className="text">
              Last Touched <RelativeTime time={props.last_touch * 1000} />
            </div>
          </li>
        )}
        {activitiesFormatter(props.dates).map((item, i) => {
          return (
            <li key={i}>
              <div className="icon">
                {item.title.includes('Birthday') ? (
                  <SvgIcon
                    path={mdiGiftOutline}
                    size={muiIconSizes.small}
                    color={theme.palette.error.main}
                  />
                ) : (
                  <SvgIcon
                    size={muiIconSizes.small}
                    path={mdiCalendarOutline}
                  />
                )}
              </div>
              <div className="text">
                {`${item.title}: ${formatDate(item.date)}`}

                {/* Disabled temporarily. Note: https://gitlab.com/rechat/web/issues/3352#note_219065917 */}
                {/* {isNearDate(item.date) && (
                  <SendContactCard
                    contactId={props.contactId}
                    buttonRenderer={btnProps => (
                      <Button {...btnProps} color="primary">
                        Send a card
                      </Button>
                    )}
                  />
                )} */}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Activity

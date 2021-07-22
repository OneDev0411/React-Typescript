import { mdiClockOutline, mdiDotsHorizontalCircleOutline } from '@mdi/js'

import { RelativeTime } from 'components/RelativeTime'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { calendarEventIcons } from 'views/utils/important-dates-icons'

import { activitiesFormatter, formatDate } from './helpers'
import { ProfileDateType } from './types'

interface ActivityPropsType {
  dates?: ProfileDateType[]
  last_touch?: number
  contactId?: string
}

function Activity(props: ActivityPropsType) {
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
                {calendarEventIcons[item.title] ? (
                  <SvgIcon
                    path={calendarEventIcons[item.title]}
                    size={muiIconSizes.small}
                  />
                ) : (
                  <SvgIcon
                    size={muiIconSizes.small}
                    path={mdiDotsHorizontalCircleOutline}
                  />
                )}
              </div>
              <div className="text">
                {`${item.title}: ${formatDate(item.date)}`}

                {/* Disabled temporarily. 
                Note: https://gitlab.com/rechat/web/issues/3352#note_219065917 */}
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

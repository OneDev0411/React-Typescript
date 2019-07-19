import React from 'react'
import timeago from 'timeago.js'

import Tooltip from 'components/tooltip'

import { NoTouches } from './styled'

interface Props {
  contact: IContact
}

export default function LastTouched({ contact }: Props) {
  const { last_touch: lastTouch, next_touch: nextTouch } = contact

  if (!lastTouch) {
    return <NoTouches className="hover-color--black">No Touches</NoTouches>
  }

  const formattedLastTouch = timeago().format(lastTouch * 1000)

  return (
    <div>
      {nextTouch ? (
        <Tooltip
          captionIsHTML
          isCustom={false}
          multiline
          caption={
            <span>
              You wanted to be in touch
              <br />
              every {Math.round((nextTouch - lastTouch) / 86400)} days.
            </span>
          }
        >
          <span>
            Last Touch was <b>{formattedLastTouch}</b>
          </span>
        </Tooltip>
      ) : (
        <span>
          Last Touch was <b>{formattedLastTouch}</b>
        </span>
      )}
    </div>
  )
}

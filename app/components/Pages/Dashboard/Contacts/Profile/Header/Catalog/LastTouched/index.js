import React from 'react'
import timeago from 'timeago.js'

export function LastTouched(props) {
  const { last_touch, next_touch } = props.contact

  return (
    <div>
      {last_touch ? (
        <div>
          <span>
            Last Touch was <b>{timeago().format(last_touch * 1000)}</b>
          </span>
          {next_touch ? (
            <span>
              , you wanted to be in touch every{' '}
              <b>{(next_touch - last_touch) / 86400}</b> days.
            </span>
          ) : (
            '.'
          )}
        </div>
      ) : (
        <div>You have not added any touches for this contact.</div>
      )}
    </div>
  )
}

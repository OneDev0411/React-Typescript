import React from 'react'
import timeago from 'timeago.js'

export function LastTouched(props) {
  const { last_touch } = props.contact

  return (
    <div>
      {last_touch ? (
        <div>
          Last Touch was <b>{timeago().format(last_touch * 1000)}</b>.
        </div>
      ) : (
        <div>You have not added any touches for this contact.</div>
      )}
    </div>
  )
}

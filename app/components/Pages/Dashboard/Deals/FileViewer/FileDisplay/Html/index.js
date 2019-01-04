import React from 'react'

export function Html(props) {
  return (
    <iframe
      title="deal--file-viewer--html"
      frameBorder="0"
      src={props.file.url}
      width="95%"
      height="90%"
    />
  )
}

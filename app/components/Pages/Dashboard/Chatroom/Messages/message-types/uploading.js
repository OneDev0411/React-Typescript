import React from 'react'
import { ProgressBar } from 'react-bootstrap'

export default ({
  message
}) => {
  const percent = (message.index * 100) / message.count

  return (
    <div className="uploading">
      <strong style={{ color: '#9b9a9b' }}>
        Uploading files - &nbsp;
        {
          message.index === message.count ?
            <span>(Finished)</span> :
            <span>({ message.index } from { message.count })</span>
        }
      </strong>

      {
        message.current &&
        <div>
          Uploading: <b>{ message.current.name }</b>
        </div>
      }

      {
        !message.current &&
        <div>Sending message ...</div>
      }

      <ProgressBar
        active={percent < 100}
        now={percent}
      />
    </div>
  )
}

import React from 'react'
import _ from 'underscore'
import Envelope from './envelope'

export default ({
  deal,
  task
}) => {
  const envelopes = deal.envelopes || []
  if (envelopes.length === 0) {
    return false
  }

  return (
    <div className="file">
      <div className="title">Sent for Signatures</div>
      <div className="file-group">
        {
          _.map(deal.envelopes, (envelope, key) =>
            <Envelope
              key={`ENVELOPE_${key}`}
              envelope={envelope}
            />
          )
        }
      </div>
    </div>
  )
}

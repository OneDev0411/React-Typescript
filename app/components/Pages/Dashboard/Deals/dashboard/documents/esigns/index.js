import React from 'react'
import _ from 'underscore'
import Envelope from './envelope'

export default ({
  deal,
  task
}) => {
  if (!task.submission) {
    return false
  }

  const envelopes = (deal.envelopes || []).filter(envelope =>
    envelope.documents.filter(doc =>
      doc.submission === task.submission.id).length > 0
  )

  if (envelopes.length === 0) {
    return false
  }

  return (
    <div className="file">
      <div className="title">Sent for Signatures</div>
      <div className="file-group">
        {
          _.map(envelopes, (envelope, key) =>
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

import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Envelope from './envelope'

const Envelopes = ({ deal, task, envelopes }) => {
  const { room } = task
  const attachments = room.attachments
    ? new Set(room.attachments.map(a => a.id))
    : new Set()

  const filteredEnvelopes = _.filter(
    deal.envelopes,
    id =>
      envelopes[id].documents &&
      envelopes[id].documents.filter(doc => {
        if (task.submission && doc.submission === task.submission.id) {
          return true
        }

        return attachments.has(doc.file)
      }).length > 0
  )

  if (filteredEnvelopes.length === 0) {
    return false
  }

  return (
    <div className="file">
      <div className="title">Sent for Signatures</div>
      <div className="file-group">
        {filteredEnvelopes.map(id => (
          <Envelope
            key={`ENVELOPE_${id}`}
            deal={deal}
            task={task}
            envelope={envelopes[id]}
          />
        ))}
      </div>
    </div>
  )
}

export default connect(({ deals }) => ({
  envelopes: deals.envelopes
}))(Envelopes)

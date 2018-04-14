import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Envelope from './envelope'

const Envelopes = ({ deal, task, envelopes }) => {
  if (!task.submission) {
    return false
  }

  const filteredEnvelopes = _.filter(
    deal.envelopes,
    id =>
      envelopes[id].documents &&
      envelopes[id].documents.filter(
        doc => doc.submission === task.submission.id
      ).length > 0
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

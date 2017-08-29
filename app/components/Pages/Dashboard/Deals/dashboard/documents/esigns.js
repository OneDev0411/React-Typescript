import React from 'react'
import _ from 'underscore'
import { Row, Col } from 'react-bootstrap'

function getRecipientsNames(recipients) {
  const names = []
  recipients.forEach(recp => {
    names.push(recp.user.display_name)
  })

  return names.join(', ')
}
export default ({
  deal,
  task
}) => {
  if (!deal.envelopes || deal.envelopes.length === 0) {
    return false
  }

  return (
    <div className="file">
      <div className="title">Sent for Signatures</div>
      <div className="file-group">
        {
          _.map(deal.envelopes, envelope =>
            {
              return (
                <Row
              className="item eSign"
              key={`eSign_${envelope.id}`}
            >
              <Col sm={1} xs={12} className="image vcenter">
                <img src="/static/images/deals/signature.svg" />
              </Col>

              <Col sm={5} xs={12} className="name vcenter">
                <div>Sent to { getRecipientsNames(envelope.recipients) }</div>
              </Col>

              <Col sm={6} xs={12} className="actions vcenter">
                <button
                  style={{ width: '100px' }}
                  className="btn-deal"
                  onClick={() => {}}
                >
                  { envelope.recipients.length } of ? Signed
                </button>
              </Col>
            </Row>)
            }
          )
        }
      </div>
    </div>
  )
}

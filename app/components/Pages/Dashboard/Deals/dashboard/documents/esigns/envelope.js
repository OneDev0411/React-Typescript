import React from 'react'
import { Row, Col, Dropdown, Button } from 'react-bootstrap'
import WhoSigned from './who-signed'

function getRecipientsNames(recipients) {
  const names = []
  recipients.forEach(recp => {
    names.push(recp.user.display_name)
  })

  return names.join(', ')
}

export default ({
  envelope
}) => {
  const { recipients } = envelope
  const areSigned = recipients.filter(r => r.status === 'Completed')
  const notSigned = recipients.filter(r => r.status !== 'Completed')

  return (
    <Row
      className="item eSign"
      key={`eSign_${envelope.id}`}
    >
      <Col sm={1} xs={12} className="image vcenter">
        <img src="/static/images/deals/signature.svg" />
      </Col>

      <Col sm={5} xs={12} className="name vcenter">
        Sent to { getRecipientsNames(recipients) }
      </Col>

      <Col sm={6} xs={12} className="actions vcenter">
        <Dropdown
          id="drp-esign-who-signed"
          className="deal-esgin-whosigned"
          pullRight
        >
          <Button
            bsRole="toggle"
            className="btn-deal deal-esgin-cta-btn"
            style={{ width: '100%' }}
          >
            {areSigned.length} of {recipients.length} Signed
          </Button>

          <WhoSigned
            envelope={envelope}
            areSigned={areSigned}
            notSigned={notSigned}
            bsRole="menu"
          />
        </Dropdown>
      </Col>
    </Row>
  )
}

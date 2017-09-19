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
    <div
      className="item eSign"
      key={`eSign_${envelope.id}`}
    >
      <div className="image">
        <img src="/static/images/deals/signature.svg" />
      </div>

      <div className="name">
        Sent to { getRecipientsNames(recipients) }
      </div>

      <div className="actions">
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
      </div>
    </div>
  )
}

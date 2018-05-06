import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import moment from 'moment'
import UserAvatar from '../../../../Partials/UserAvatar'
import Deal from '../../../../../models/Deal'
import { voidEnvelope } from '../../../../../store_actions/deals'
import { confirmation } from '../../../../../store_actions/confirmation'

class WhoSigned extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resending: false
    }
  }

  getName(role) {
    if (role.legal_last_name || role.legal_first_name) {
      return `${role.legal_prefix || ''} ${role.legal_first_name ||
        ''} ${role.legal_last_name || ''}`.trim()
    } else if (role.user) {
      return role.user.display_name
    }
  }

  async resendDocs(envelopeId) {
    const { notify } = this.props

    this.setState({
      resending: true
    })

    // resending docs
    try {
      await Deal.resendEnvelope(envelopeId)
      notify({
        message: 'eSignature has resent',
        status: 'success'
      })
    } catch (e) {
      notify({
        message: 'Could not resend eSignature, please try again',
        status: 'error'
      })
    }

    this.setState({
      resending: false
    })
  }

  requestVoidEnvelope(envelopeId) {
    const { confirmation } = this.props

    confirmation({
      message: 'Once you void this form you cannot edit or send for signatures',
      confirmLabel: 'Void',
      onConfirm: () => this.voidEnvelope(envelopeId)
    })
  }

  async voidEnvelope(envelopeId) {
    const { deal, voidEnvelope, notify, onClose } = this.props

    try {
      voidEnvelope(deal.id, envelopeId)
      onClose()
    } catch (e) {
      notify({
        message: 'Can not void this eSign',
        status: 'error'
      })
    }
  }

  render() {
    const { resending } = this.state
    const { envelope, user } = this.props
    const { access_token } = user
    const { recipients } = envelope
    const areSigned = recipients.filter(r => r.status === 'Completed')
    const notSigned = recipients.filter(r => r.status !== 'Completed')
    const declineds = recipients.filter(r => r.status === 'Declined')

    const isDraft = envelope.status === 'Created'
    const isVoided = envelope.status === 'Voided'
    const isCompleted = envelope.status === 'Completed'
    const isSent = envelope.status === 'Sent'

    return (
      <div className="who-signed">
        <div className="ws-head">
          <div className="ttl">
            {isDraft ? 'Draft' : 'Who signed'}
          </div>
          <div className="cta">
            {isSent && (
              <Button
                className="deal-button"
                disabled={resending}
                onClick={() => this.resendDocs(envelope.id)}
              >
                {resending ? 'Resending ...' : 'Resend docs'}
              </Button>
            )}

            {isDraft && (
              <a
                href={Deal.getEnvelopeEditLink(envelope.id, access_token)}
                target="_blank"
                className="btn btn-primary btn-sm btn-outline"
              >
                Review & Send
              </a>
            )}

            {(isDraft || isSent) && (
              <Button
                className="deal-button void"
                onClick={() => this.requestVoidEnvelope(envelope.id)}
              >
                Void
              </Button>
            )}
          </div>
        </div>

        {areSigned.length > 0 && (
          <div className="ws-section">
            <div className="ws-section-title">
              <img src="/static/images/deals/ws.svg" alt="" />
              SIGNED BY
            </div>

            {areSigned.map((signer, key) => (
              <div key={`ARE_SIGNED_${key}`} className="ws-section-body">
                <div className="avatar">
                  <UserAvatar
                    name={this.getName(signer.role)}
                    image={
                      signer.user && signer.user.profile_image_thumbnail_url
                    }
                    size={30}
                    showStateIndicator={false}
                  />
                </div>
                <div className="info">
                  <div className="sname">{this.getName(signer.role)}</div>
                  <div className="date">
                    Signed{' '}
                    {moment
                      .unix(signer.updated_at)
                      .format('HH:mm A dddd MMM DD, YYYY')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isDraft && notSigned.length > 0 && (
          <div className="ws-section">
            <div className="ws-section-title">
              <img src="/static/images/deals/ws.svg" alt="" />
              HAS NOT SIGNED
            </div>

            {notSigned.map((signer, key) => (
              <div key={`NOT_SIGNED_${key}`} className="ws-section-body">
                <div className="avatar">
                  <UserAvatar
                    name={this.getName(signer.role)}
                    image={
                      signer.user && signer.user.profile_image_thumbnail_url
                    }
                    size={30}
                    showStateIndicator={false}
                  />
                </div>
                <div className="info">
                  <div className="sname">{this.getName(signer.role)}</div>
                </div>

                /*
                 * Disabled due to web#1178
                 *
                <div className="sign-now">
                  {signer.role.user &&
                    signer.role.user.id === user.id && (
                      <a
                        href={Deal.getEnvelopeSignLink(envelope.id, signer.id, access_token)}
                        target="_blank"
                        className="sign-button"
                      >
                        Sign now
                      </a>
                    )}
                </div>
                */
              </div>
            ))}
          </div>
        )}

        {declineds.length > 0 && (
          <div className="ws-section">
            <div className="ws-section-title">
              <img src="/static/images/deals/ws.svg" />
              DECLINED TO SIGN
            </div>

            {declineds.map((signer, key) => (
              <div key={`DECLINED_${key}`} className="ws-section-body">
                <div className="avatar">
                  <UserAvatar
                    name={this.getName(signer.role)}
                    image={
                      signer.user && signer.user.profile_image_thumbnail_url
                    }
                    size={30}
                    showStateIndicator={false}
                  />
                </div>
                <div className="info">
                  <div className="sname">{this.getName(signer.role)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    roles: deals.roles,
    user
  }),
  { voidEnvelope, confirmation, notify }
)(WhoSigned)

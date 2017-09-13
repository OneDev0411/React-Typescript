import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import UserAvatar from '../../../../../../Partials/UserAvatar'
import Deal from '../../../../../../../models/Deal'
import config from '../../../../../../../../config/public'

class WhoSigned extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resending: false
    }
  }

  getSignLink(eid) {
    const { user } = this.props
    const token = user.access_token
    return `${config.app.url}/api/deals/envelope/${eid}/sign?access_token=${token}`
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
        message: 'eSign has been resent',
        status: 'success'
      })
    } catch (e) {
      notify({
        message: 'Can not resend eSign right now, please try again',
        status: 'error'
      })
    }

    this.setState({
      resending: false
    })
  }

  render () {
    const { resending } = this.state
    const { areSigned, notSigned, envelope, user } = this.props

    return (
      <div className="dropdown-menu dropdown-menu-right who-signed">
        <div className="ws-head">
          <div className="ttl">
            Who signed
          </div>
          <div className="cta">
            <Button
              className="deal-button"
              disabled={resending}
              onClick={() => this.resendDocs(envelope.id)}
            >
              { resending ? 'Resending ...' : 'Resend docs' }
            </Button>
          </div>
        </div>

        {
          areSigned.length > 0 &&
          <div className="ws-section">
            <div className="ws-section-title">
              <img src="/static/images/deals/ws.svg" />
              SIGNED BY
            </div>

            {
              areSigned.map(signer =>
                <div className="ws-section-body">
                  <div className="avatar">
                    <UserAvatar
                      name={signer.user.display_name}
                      image={signer.user.profile_image_thumbnail_url}
                      size={30}
                      showStateIndicator={false}
                    />
                  </div>
                  <div className="info">
                    <div className="name">{ signer.user.display_name }</div>
                    <div className="date">-</div>
                  </div>
                </div>
              )
            }
          </div>
        }

        {
          notSigned.length > 0 &&
          <div className="ws-section">
            <div className="ws-section-title">
              <img src="/static/images/deals/ws.svg" />
              HAS NOT SIGNED
            </div>

            {
              notSigned.map(signer =>
                <div className="ws-section-body">
                  <div className="avatar">
                    <UserAvatar
                      name={signer.user.display_name}
                      image={signer.user.profile_image_thumbnail_url}
                      size={30}
                      showStateIndicator={false}
                    />
                  </div>
                  <div className="info">
                    <div className="name">{ signer.user.display_name }</div>
                  </div>

                  <div className="sign-now">
                    {
                      signer.user.id === user.id &&
                      <a
                        href={this.getSignLink(envelope.id)}
                        target="_blank"
                        className="sign-button"
                      >
                        Sign now
                      </a>
                    }
                  </div>
                </div>
              )
            }
          </div>
        }
      </div>
    )
  }
}

export default connect(({ data }) => ({
  user: data.user
}), { notify })(WhoSigned)

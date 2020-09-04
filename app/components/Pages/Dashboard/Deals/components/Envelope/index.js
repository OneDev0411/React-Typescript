import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import moment from 'moment'

import { Button } from '@material-ui/core'

import { voidEnvelope } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { getEnvelopeEditLink } from 'models/Deal/helpers/get-envelope-edit-link'
import Deal from 'models/Deal'

import Avatar from 'components/Avatar'

import Tooltip from 'components/tooltip'

import { getLegalFullName } from '../../utils/roles'

import {
  Header,
  Title,
  TitleContainer,
  WhoSignedContainer,
  WhoSignedHeader,
  WhoSignedRow,
  RoleName,
  SignDate
} from './styled'

class Envelope extends React.Component {
  state = {
    isResending: false,
    isVoiding: false
  }

  resendDocs = async () => {
    this.setState({
      isResending: true
    })

    // resending docs
    try {
      await Deal.resendEnvelope(this.props.envelope.id)
      this.props.notify({
        message: 'eSignature has resent',
        status: 'success'
      })
    } catch (e) {
      this.props.notify({
        message: 'Could not resend eSignature, please try again',
        status: 'error'
      })
    }

    this.setState({
      isResending: false
    })
  }

  requestVoidEnvelope = () =>
    this.props.confirmation({
      message: 'Are you sure you want void this Docusign?',
      confirmLabel: 'Void',
      onConfirm: this.voidEnvelope
    })

  voidEnvelope = async () => {
    this.setState({
      isVoiding: true
    })

    try {
      await this.props.voidEnvelope(this.props.deal.id, this.props.envelope.id)

      this.setState({
        isVoiding: false
      })
    } catch (e) {
      console.log(e)

      this.props.notify({
        message: 'Can not void this eSign',
        status: 'error'
      })
    }
  }

  render() {
    const { envelope } = this.props
    const { recipients } = envelope

    const areSigned = recipients.filter(r => r.status === 'Completed')
    const notSigned = recipients.filter(r => r.status !== 'Completed')
    const declineds = recipients.filter(r => r.status === 'Declined')

    const isDraft = envelope.status === 'Created'
    const isSent = envelope.status === 'Sent'
    const isVoided = envelope.status === 'Voided'
    const isVoidable = ['Created', 'Sent', 'Delivered'].includes(
      envelope.status
    )

    return (
      <div style={this.props.containerStyle}>
        <Header>
          <Title>{isDraft ? 'Draft' : 'Who signed'}</Title>

          <div>
            {isSent && (
              <Button
                size="small"
                variant="outlined"
                disabled={this.state.isResending}
                onClick={this.resendDocs}
              >
                Resend docs
              </Button>
            )}

            {isDraft && (
              <Button
                color="secondary"
                size="small"
                href={getEnvelopeEditLink(
                  envelope.id,
                  this.props.user.access_token
                )}
                target="_blank"
              >
                Review & Send
              </Button>
            )}

            <Button
              size="small"
              variant="outlined"
              disabled={!isVoidable || isVoided || this.state.isVoiding}
              onClick={this.requestVoidEnvelope}
            >
              <Tooltip
                caption={
                  isVoidable
                    ? null
                    : 'You are not allowed to void this docusign'
                }
                placement="left"
              >
                <span>{isVoided ? 'Voided' : 'Void'}</span>
              </Tooltip>
            </Button>
          </div>
        </Header>

        {areSigned.length > 0 && (
          <WhoSignedContainer>
            <WhoSignedHeader>Signed By</WhoSignedHeader>

            {areSigned.map((signer, key) => (
              <WhoSignedRow key={key}>
                <Avatar
                  title={getLegalFullName(signer.role)}
                  image={signer.user && signer.user.profile_image_thumbnail_url}
                  size={30}
                />

                <TitleContainer>
                  <RoleName>{getLegalFullName(signer.role)}</RoleName>
                  <SignDate>
                    Signed&nbsp;
                    {moment
                      .unix(signer.updated_at)
                      .format('HH:mm A dddd MMM DD, YYYY')}
                  </SignDate>
                </TitleContainer>
              </WhoSignedRow>
            ))}
          </WhoSignedContainer>
        )}

        {notSigned.length > 0 && (
          <WhoSignedContainer>
            <WhoSignedHeader>Has Not Signed</WhoSignedHeader>

            {notSigned.map((signer, key) => (
              <WhoSignedRow key={key}>
                <Avatar
                  title={getLegalFullName(signer.role)}
                  image={signer.user && signer.user.profile_image_thumbnail_url}
                  size={30}
                />

                <RoleName>{getLegalFullName(signer.role)}</RoleName>
              </WhoSignedRow>
            ))}
          </WhoSignedContainer>
        )}

        {declineds.length > 0 && (
          <WhoSignedContainer>
            <WhoSignedHeader>Declined To Sign</WhoSignedHeader>

            {declineds.map((signer, key) => (
              <WhoSignedRow key={key}>
                <Avatar
                  title={getLegalFullName(signer.role)}
                  image={signer.user && signer.user.profile_image_thumbnail_url}
                  size={30}
                />

                <RoleName>{getLegalFullName(signer.role)}</RoleName>
              </WhoSignedRow>
            ))}
          </WhoSignedContainer>
        )}
      </div>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return { roles: deals.roles, user }
}

export default connect(mapStateToProps, { voidEnvelope, confirmation, notify })(
  Envelope
)

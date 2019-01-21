import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import moment from 'moment'

import LinkButton from 'components/Button/LinkButton'
import ActionButton from 'components/Button/ActionButton'
import Avatar from 'components/Avatar'

import { voidEnvelope } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import Deal from 'models/Deal'

import { getLegalFullName } from '../../utils/roles'

import { SideMenu } from '../styled'
import {
  Container,
  Header,
  Title,
  TitleContainer,
  WhoSignedContainer,
  WhoSignedHeader,
  WhoSignedRow,
  RoleName,
  SignDate
} from './styled'

class EnvelopeSideMenu extends React.Component {
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
      message: 'Once you void this form you cannot edit or send for signatures',
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

    return (
      <SideMenu width="35rem" isOpen style={{ marginRight: 0 }}>
        <Container>
          <Header>
            <Title>{isDraft ? 'Draft' : 'Who signed'}</Title>

            <div>
              {isSent && (
                <ActionButton
                  size="small"
                  disabled={this.state.isResending}
                  onClick={this.resendDocs}
                >
                  Resend docs
                </ActionButton>
              )}

              {isDraft && (
                <LinkButton
                  appearance="primary"
                  size="small"
                  href={Deal.getEnvelopeEditLink(
                    envelope.id,
                    this.props.user.access_token
                  )}
                  target="_blank"
                >
                  Review & Send
                </LinkButton>
              )}

              <ActionButton
                size="small"
                appearance="outline"
                disabled={isVoided || this.state.isVoiding}
                onClick={this.requestVoidEnvelope}
              >
                {isVoided ? 'Voided' : 'Void'}
              </ActionButton>
            </div>
          </Header>

          {areSigned.length > 0 && (
            <WhoSignedContainer>
              <WhoSignedHeader>Signed By</WhoSignedHeader>

              {areSigned.map((signer, key) => (
                <WhoSignedRow key={key}>
                  <Avatar
                    title={getLegalFullName(signer.role)}
                    image={
                      signer.user && signer.user.profile_image_thumbnail_url
                    }
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
                    image={
                      signer.user && signer.user.profile_image_thumbnail_url
                    }
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
                    image={
                      signer.user && signer.user.profile_image_thumbnail_url
                    }
                    size={30}
                  />

                  <RoleName>{getLegalFullName(signer.role)}</RoleName>
                </WhoSignedRow>
              ))}
            </WhoSignedContainer>
          )}
        </Container>
      </SideMenu>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return { roles: deals.roles, user }
}

export default connect(
  mapStateToProps,
  { voidEnvelope, confirmation, notify }
)(EnvelopeSideMenu)

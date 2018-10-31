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
  WhoSignedContainer,
  WhoSignedHeader,
  WhoSignedRow,
  RoleName,
  SignDate
} from './styled'

class EnvelopeSideMenu extends React.Component {
  state = {
    isResending: false
  }

  resendDocs = () => {
    const { envelope } = this.props
  }

  render() {
    const { envelope } = this.props
    const { recipients } = envelope

    const areSigned = recipients.filter(r => r.status === 'Completed')
    const notSigned = recipients.filter(r => r.status !== 'Completed')
    const declineds = recipients.filter(r => r.status === 'Declined')

    const isDraft = envelope.status === 'Created'
    const isSent = envelope.status === 'Sent'

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

              <ActionButton size="small" appearance="outline">
                Void
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

                  <div>
                    <RoleName>{getLegalFullName(signer.role)}</RoleName>
                    <SignDate>
                      Signed&nbsp;
                      {moment
                        .unix(signer.updated_at)
                        .format('HH:mm A dddd MMM DD, YYYY')}
                    </SignDate>
                  </div>
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

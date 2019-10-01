import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ActionButton from 'components/Button/ActionButton'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import MissingEmailModal from 'components/MissingEmailModal'
import { normalizeUserForEmailFrom } from 'models/email/helpers/normalize-user-for-email-from'

function SendEmailButton(props) {
  const { deal } = props
  const [isOpen, setIsOpen] = useState(false)
  const [isMissingEmailModalOpen, setIsMissingEmailModalOpen] = useState(false)

  const onSendClick = () => {
    if (Array.isArray(props.recipients) && props.recipients.length === 0) {
      setIsMissingEmailModalOpen(true)

      return
    }

    setIsOpen(true)
  }

  const getEmail = email => {
    if (deal != null && deal.id) {
      return {
        ...email,
        deal: deal.id
      }
    }

    return email
  }

  return (
    <Fragment>
      {props.render ? (
        props.render({ onClick: onSendClick, testId: 'send-email' })
      ) : (
        <ActionButton
          disabled={props.disabled}
          appearance={props.appearance}
          style={props.style}
          onClick={onSendClick}
          data-test="send-email"
        >
          {props.title}
        </ActionButton>
      )}
      {/*
       We conditionally render, beacause of this comment:
       https://gitlab.com/rechat/web/merge_requests/376#note_200055872
       We can either change email compose component to eliminate this
       limitation, or set drawerIsOpen asynchronously in order to
       enable animation
      */}
      {isMissingEmailModalOpen && (
        <MissingEmailModal
          isOpen
          onClose={() => setIsMissingEmailModalOpen(false)}
          action="send an email"
        />
      )}
      {isOpen && !isMissingEmailModalOpen && (
        <SingleEmailComposeDrawer
          isOpen={isOpen}
          initialValues={{
            attachments: [],
            to: props.recipients,
            from: normalizeUserForEmailFrom(props.user)
          }}
          deal={deal}
          onClose={() => setIsOpen(false)}
          onSent={() => {
            setIsOpen(false)
            props.onSent()
          }}
          getEmail={getEmail}
        />
      )}
    </Fragment>
  )
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

SendEmailButton.propTypes = {
  disabled: PropTypes.bool,
  deal: PropTypes.object,
  defaultAttachments: PropTypes.array,
  recipients: PropTypes.array,
  appearance: PropTypes.string,
  title: PropTypes.string,
  onSent: PropTypes.func
}

SendEmailButton.defaultProps = {
  disabled: false,
  deal: null,
  defaultAttachments: [],
  recipients: null,
  appearance: 'outline',
  title: 'Email',
  onSent: () => {}
}

export default connect(mapStateToProps)(SendEmailButton)

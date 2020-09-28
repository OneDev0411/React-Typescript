import React, { useState } from 'react'

import { Button } from '@material-ui/core'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import MissingEmailModal from 'components/MissingEmailModal'

export default function SendEmailButton(props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMissingEmailModalOpen, setIsMissingEmailModalOpen] = useState(false)

  const onSendClick = () => {
    if (Array.isArray(props.recipients) && props.recipients.length === 0) {
      setIsMissingEmailModalOpen(true)

      return
    }

    setIsOpen(true)
  }

  return (
    <>
      {props.render ? (
        props.render({ onClick: onSendClick, testId: 'send-email' })
      ) : (
        <Button
          disabled={props.disabled}
          variant={props.appearance}
          size={props.size}
          style={props.style}
          onClick={onSendClick}
          data-test="send-email"
        >
          {props.title}
        </Button>
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
            to: props.recipients
          }}
          onClose={() => setIsOpen(false)}
          onSent={() => {
            props.onSent()
            setIsOpen(false)
          }}
        />
      )}
    </>
  )
}

SendEmailButton.defaultProps = {
  disabled: false,
  deal: null,
  defaultAttachments: [],
  recipients: null,
  appearance: 'outlined',
  size: 'medium',
  title: 'Email',
  onSent: () => {}
}

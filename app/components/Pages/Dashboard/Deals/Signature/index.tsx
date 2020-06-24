import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { confirmation } from 'actions/confirmation'
import { createEnvelope } from 'actions/deals'

import Deal from 'models/Deal'
import { getEnvelopeEditLink } from 'models/Deal/helpers/get-envelope-edit-link'

import { IAppState } from 'reducers'

import { SignatureComposeDrawer } from './Compose'
import { DocusignAuthentication } from './DocusignAuthentication'
import type { FormValues } from './types'

interface Props {
  isOpen: boolean
  deal: IDeal
  defaultAttachments: any[]
  onClose: () => void
}

export default function Signature({
  isOpen,
  deal,
  defaultAttachments,
  onClose
}: Props) {
  const [isSending, setIsSending] = useState(false)
  const [showDocusignBanner, setShowDocusignBanner] = useState(false)
  const [formData, setFormData] = useState<FormValues | null>(null)

  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const openDocusign = (envelope: IDealEnvelope) => {
    const url = getEnvelopeEditLink(envelope.id, user.access_token)

    window.open(url, '_blank')

    onClose()
  }

  const handleSubmit = async (form: FormValues) => {
    const attachments = Object.values(form.attachments).map(attachment => {
      return attachment.source === 'submission'
        ? {
            task: attachment.task
          }
        : {
            file: attachment.id
          }
    })

    const recipients = Object.values(form.recipients).map(recipient => ({
      role: recipient.id,
      order: recipient.order,
      envelope_recipient_type: recipient.envelope_recipient_type
    }))

    setIsSending(true)
    setShowDocusignBanner(false)

    try {
      // add envelope to list of envelopes
      const envelope = await Deal.sendEnvelope(
        deal.id,
        form.subject,
        form.message,
        attachments,
        recipients,
        form.auto_notify
      )

      await dispatch(createEnvelope(envelope))

      // reset recipients
      setIsSending(false)
      setFormData(null)

      dispatch(
        confirmation({
          description: 'Your envelope is ready',
          confirmLabel: 'Review in Docusign',
          hideCancelButton: true,
          onConfirm: () => openDocusign(envelope)
        })
      )
    } catch (e) {
      console.log(e)

      const isDocusignError = ~~e.status === 412

      setIsSending(false)
      setShowDocusignBanner(isDocusignError)
      setFormData(isDocusignError ? form : null)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      <SignatureComposeDrawer
        user={user}
        deal={deal}
        attachments={defaultAttachments}
        isOpen={!showDocusignBanner}
        isSubmitting={isSending}
        onSubmit={handleSubmit}
        onClose={onClose}
      />

      <DocusignAuthentication
        user={user}
        isOpen={showDocusignBanner}
        onAuthorize={() => handleSubmit(formData!)}
      />
    </>
  )
}

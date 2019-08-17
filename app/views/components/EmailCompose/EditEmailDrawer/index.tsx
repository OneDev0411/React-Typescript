import * as React from 'react'
import { ComponentProps, useEffect, useState } from 'react'

import { getEmail } from 'models/email/get-email'

import { notUndefined } from 'utils/ts-utils'

import { BulkEmailComposeDrawer } from '../BulkEmailComposeDrawer'
import { SingleEmailComposeDrawer } from '../SingleEmailComposeDrawer'
import { EmailRecipient, Recipient } from '../../ContactsChipsInput/types'
import { EmailFormValues } from '../types'

interface Props {
  email: IEmailCampaign
  isOpen: boolean
  onClose: () => void
}

export function EditEmailDrawer({ email, isOpen, onClose }: Props) {
  const [data, setData] = useState<IEmailCampaign<
    'from' | 'recipients',
    'contact' | 'list'
  > | null>(null)

  useEffect(() => {
    let canceled = false

    if (isOpen) {
      setData(null)
      getEmail(email.id).then(fullEmailObject => {
        if (!canceled) {
          setData(fullEmailObject)
        }
      })
    }

    return () => {
      canceled = true
    }
  }, [email.id, isOpen])

  if (data) {
    const initialValues: Partial<EmailFormValues> = {
      from: data.from,
      subject: data.subject,
      body: data.html,
      due_at: data.due_at ? new Date(data.due_at * 1000) : null,
      to: getRecipientsFromRecipientsEntity('To', data.recipients)
    }

    if (!data.individual) {
      initialValues.cc = getRecipientsFromRecipientsEntity(
        'CC',
        data.recipients
      )
      initialValues.bcc = getRecipientsFromRecipientsEntity(
        'BCC',
        data.recipients
      )
    }

    const commonProps: ComponentProps<typeof BulkEmailComposeDrawer> &
      ComponentProps<typeof SingleEmailComposeDrawer> = {
      initialValues,
      emailId: data.id,
      isOpen,
      onClose,
      onSent: onClose
    }

    return data.individual ? (
      <BulkEmailComposeDrawer {...commonProps} />
    ) : (
      <SingleEmailComposeDrawer {...commonProps} />
    )
  }

  return null
}

function getRecipientsFromRecipientsEntity(
  recipientType: IEmailRecipient['recipient_type'],
  recipients: IEmailRecipient<'list' | 'contact'>[]
): Recipient[] {
  return recipients
    .filter(recipient => recipient.recipient_type === recipientType)
    .map(recipient => {
      if (recipient.tag) {
        return {
          type: 'crm_tag',
          text: recipient.tag
        } as IContactTag
      }

      if (recipient.list) {
        return recipient.list
      }

      if (recipient.email) {
        return {
          email: recipient.email,
          contact: recipient.contact as INormalizedContact | undefined
        } as EmailRecipient
      }
    })
    .filter(notUndefined)
}

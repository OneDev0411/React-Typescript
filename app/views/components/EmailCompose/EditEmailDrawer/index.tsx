import * as React from 'react'
import { ComponentProps, useEffect, useState } from 'react'

import { getEmailCampaign } from 'models/email/get-email-campaign'

import { notUndefined } from 'utils/ts-utils'

import { normalizeContact } from 'models/contacts/helpers/normalize-contact'

import { BulkEmailComposeDrawer } from '../BulkEmailComposeDrawer'
import { SingleEmailComposeDrawer } from '../SingleEmailComposeDrawer'
import { EmailRecipient, Recipient } from '../../ContactsChipsInput/types'
import { EmailFormValues } from '../types'

interface Props {
  emailId: string
  isOpen: boolean
  onClose: () => void
  onEdited: (email: IEmailCampaign) => void
}

export function EditEmailDrawer({ emailId, isOpen, onClose, onEdited }: Props) {
  const [data, setData] = useState<IEmailCampaign<
    'from' | 'recipients' | 'template' | 'emails' | 'attachments',
    'contact' | 'list'
  > | null>(null)

  useEffect(() => {
    let canceled = false

    if (isOpen) {
      setData(null)
      getEmailCampaign(emailId).then(fullEmailObject => {
        if (!canceled) {
          setData(fullEmailObject)
        }
      })
    }

    return () => {
      canceled = true
    }
  }, [emailId, isOpen])

  if (data) {
    const initialValues: Partial<EmailFormValues> = {
      attachments: (data.attachments || []).map(normalizeAttachment),
      // TODO: we can update attachment item to remove the need for unnecessary
      //  normalization of attachments.
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
      hasStaticBody: !!data.template,
      isOpen,
      onClose,
      onSent: email => {
        onClose()
        onEdited(email)
      }
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
  sendType: IEmailRecipient['send_type'],
  recipients: IEmailRecipient<'list' | 'contact'>[]
): Recipient[] {
  return recipients
    .filter(recipient => recipient.send_type === sendType)
    .map(recipient => {
      if (recipient.recipient_type === 'Tag') {
        return {
          type: 'crm_tag',
          text: recipient.tag
        } as IContactTag
      }

      if (recipient.recipient_type === 'List') {
        return recipient.list
      }

      if (recipient.recipient_type === 'Email') {
        return {
          email: recipient.email,
          contact: normalizeContact(recipient.contact)
        } as EmailRecipient
      }
    })
    .filter(notUndefined)
}

/**
 * We have another normalizeAttachment which seems to be different!
 * @param item
 */
const normalizeAttachment = item => ({
  title: decodeURI(item.name),
  url: item.url,
  date: new Date(item.created_at * 1000)
})

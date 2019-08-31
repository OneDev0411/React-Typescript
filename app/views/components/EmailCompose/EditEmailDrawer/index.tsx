import * as React from 'react'
import { ComponentProps, useEffect, useState } from 'react'

import { getEmailCampaign } from 'models/email/get-email-campaign'

import { BulkEmailComposeDrawer } from '../BulkEmailComposeDrawer'
import { SingleEmailComposeDrawer } from '../SingleEmailComposeDrawer'
import { EmailFormValues } from '../types'

interface Props {
  emailId: string
  isOpen: boolean
  onClose: () => void
  onEdited: (email: IEmailCampaign) => void
}

export function EditEmailDrawer({ emailId, isOpen, onClose, onEdited }: Props) {
  const [data, setData] = useState<IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation
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
      attachments: data.attachments || [],
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
  recipients: IEmailRecipient<IEmailCampaignRecipientAssociation>[]
): IDenormalizedEmailRecipientInput[] {
  return recipients
    .filter(recipient => recipient.send_type === sendType)
    .map<IDenormalizedEmailRecipientInput>(recipient => {
      // With this switch case, if new type of recipients are added ever,
      // we get a ts error here and we need to fix it.
      switch (recipient.recipient_type) {
        case 'Tag':
          return {
            recipient_type: 'Tag',
            tag: {
              type: 'crm_tag',
              text: recipient.tag
            } as IContactTag
          }
        case 'List':
          return {
            recipient_type: 'List',
            list: recipient.list
          }
        case 'Email':
          return {
            recipient_type: 'Email',
            email: recipient.email!,
            contact: recipient.contact
          }
        case 'AllContacts':
          return {
            recipient_type: 'AllContacts'
          }
        case 'Brand':
          return {
            recipient_type: 'Brand',
            brand: recipient.brand
          }
      }
    })
}

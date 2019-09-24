import * as React from 'react'
import { ComponentProps, useEffect, useState } from 'react'

import { getEmailCampaign } from 'models/email/get-email-campaign'

import { BulkEmailComposeDrawer } from '../BulkEmailComposeDrawer'
import { SingleEmailComposeDrawer } from '../SingleEmailComposeDrawer'
import { EmailFormValues } from '../types'
import { getRecipientsFromRecipientsEntity } from './helpers/get-recipients-from-recipients-entity'
import getTemplateInstancePreviewImage from '../../InstantMarketing/helpers/get-template-preview-image'

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
      body: data.template
        ? getTemplateInstancePreviewImage(data.template)
        : data.html,
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
      getEmail: values => ({
        ...values,
        html: data.template ? data.html : values.html
      }),
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

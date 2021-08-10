import * as React from 'react'
import {
  ComponentProps,
  useCallback,
  useEffect,
  useState,
  useContext
} from 'react'

import { deleteEmailCampaign } from 'models/email/delete-email-campaign'
import { getEmailCampaign } from 'models/email/get-email-campaign'

import ConfirmationModalContext from '../../ConfirmationModal/context'
import getTemplateInstancePreviewImage from '../../InstantMarketing/helpers/get-template-preview-image'
import { BulkEmailComposeDrawer } from '../BulkEmailComposeDrawer'
import { hasMultipleRecipients } from '../helpers/has-multiple-recipients'
import { SingleEmailComposeDrawer } from '../SingleEmailComposeDrawer'
import { EmailFormValues } from '../types'

import { getRecipientsFromRecipientsEntity } from './helpers/get-recipients-from-recipients-entity'

interface Props {
  emailId: string
  isOpen: boolean
  onClose: () => void
  onDeleted?: () => void
  onEdited: (email: IEmailCampaign) => void
}

export function EditEmailDrawer({
  emailId,
  isOpen,
  onClose,
  onDeleted = () => {},
  onEdited
}: Props) {
  const [data, setData] = useState<IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation
  > | null>(null)
  const confirmationModal = useContext(ConfirmationModalContext)

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

  const deleteEmail = useCallback(
    async (values: EmailFormValues) => {
      const deleteAndClose = async () => {
        await deleteEmailCampaign(emailId)
        onDeleted()
        onClose()
      }

      if (hasMultipleRecipients(values.to, values.cc, values.bcc)) {
        return new Promise((resolve, reject) => {
          confirmationModal.setConfirmationModal({
            message: 'Warning!',
            description:
              'This change will affect all contacts on this email.  Proceed?',
            confirmLabel: 'Yes, remove it',
            appearance: 'danger',
            onConfirm: async () => {
              try {
                await deleteAndClose()
                resolve(true)
              } catch (e) {
                console.error(e)
                reject(e)
              }
            },
            onCancel: reject
          })
        })
      }

      // We only show confirmation dialog in case it has multiple recipients!
      // here is the related discussion:
      // https://gitlab.com/rechat/web/issues/3460#note_230027044
      await deleteAndClose()
    },
    [confirmationModal, emailId, onClose, onDeleted]
  )

  if (data) {
    const initialValues: Partial<EmailFormValues> = {
      attachments: (data.attachments || []).map(attachment => attachment.file),
      from: data.from,
      subject: data.subject,
      body: data.template
        ? getTemplateInstancePreviewImage(data.template)
        : data.html,
      due_at: data.due_at ? new Date(data.due_at * 1000) : null,
      to: getRecipientsFromRecipientsEntity('To', data.recipients),
      templateInstance: data.template,
      notifications_enabled: data.notifications_enabled
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
        html: values.template ? '' : values.html
      }),
      onClose,
      onDelete: deleteEmail,
      onSent: email => {
        onClose()
        onEdited(email as IEmailCampaign)
      }
    }

    return data.individual ? (
      <BulkEmailComposeDrawer {...commonProps} />
    ) : (
      <SingleEmailComposeDrawer {...commonProps} headers={data.headers || {}} />
    )
  }

  return null
}

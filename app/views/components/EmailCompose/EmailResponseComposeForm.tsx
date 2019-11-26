import React, { useCallback, useMemo } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { useRerenderOnChange } from 'hooks/use-rerender-on-change'

import { EmailThreadFormValues } from './types'
import { getReplyRecipients } from './helpers/get-reply-recipients'
import { getReplyHtml } from './helpers/get-reply-html'
import { getForwardHtml } from './helpers/get-forward-html'
import { attachmentToFile } from '../EmailThread/helpers/attachment-to-file'
import { getReplySubject } from './helpers/get-reply-subject'
import EmailThreadComposeForm from './EmailThreadComposeForm'
import { EmailResponseType } from '../EmailThread/types'
import { encodeContentIds } from '../EmailThread/helpers/encode-content-ids'
import { getAccountTypeFromOrigin } from './helpers/get-account-type-from-origin'
import { convertToAbsoluteAttachmentUrl } from '../EmailThread/helpers/convert-to-absolute-attachment-url'
import { oAuthAccountTypeToProvider } from '../../../components/Pages/Dashboard/Account/ConnectedAccounts/constants'

interface Props {
  responseType: EmailResponseType
  email: IEmailThreadEmail
  defaultFrom?: string
  onCancel: () => void
  onSent: (email: IEmailThreadEmail) => void
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      footer: {
        position: 'sticky',
        bottom: 0,
        zIndex: 1,
        background: theme.palette.background.paper
      }
    }),
  { name: 'EmailThreadComposeForm' }
)

export function EmailResponseComposeForm({
  responseType,
  email,
  defaultFrom,
  onCancel,
  onSent
}: Props) {
  const classes = useStyles()

  const initialValue = useMemo<EmailThreadFormValues>(() => {
    const { to, cc } =
      responseType === 'forward'
        ? { to: [], cc: [] }
        : getReplyRecipients(email, responseType === 'replyAll')

    const owner = email.owner || defaultFrom
    const from = owner
      ? {
          label: '',
          value: owner
        }
      : undefined

    return {
      from,
      to,
      cc,
      bcc: [],
      body:
        responseType === 'forward'
          ? getForwardHtml(email)
          : getReplyHtml(email),
      due_at: null,
      attachments:
        responseType === 'forward'
          ? email.attachments.map(attachmentToFile)
          : [],
      subject: getReplySubject(responseType, email)
    }
  }, [defaultFrom, email, responseType])

  const getEmail = useCallback(
    (emailInput: IEmailThreadEmailInput, fromAccount: IOAuthAccount) => {
      const originType = getAccountTypeFromOrigin(email.origin)
      const originMatchesFrom =
        !originType ||
        originType === oAuthAccountTypeToProvider[fromAccount.type]

      const html = encodeContentIds(email.attachments, emailInput.html)

      const inlineAttachments: IEmailAttachmentInput[] = email.attachments
        .filter(
          attachment => attachment.cid && html.includes(`cid:${attachment.cid}`)
        )
        .map(({ cid, contentType: type, isInline, name: filename, url }) => ({
          filename,
          isInline,
          link: convertToAbsoluteAttachmentUrl(url),
          cid,
          type
        }))

      const attachments = emailInput.attachments
        // filter out inline attachments
        .filter(
          attachment =>
            !inlineAttachments.some(item => item.link === attachment.link)
        )

      return {
        ...emailInput,
        html,
        attachments: attachments.concat(inlineAttachments),
        threadId: originMatchesFrom ? email.thread_id : undefined,
        messageId: originMatchesFrom ? email.message_id : undefined,
        inReplyTo: email.internet_message_id
      }
    },
    [
      email.attachments,
      email.internet_message_id,
      email.message_id,
      email.origin,
      email.thread_id
    ]
  )

  const shouldRender = useRerenderOnChange(responseType)

  return (
    shouldRender && (
      <EmailThreadComposeForm
        onCancel={onCancel}
        onSent={onSent}
        classes={{ footer: classes.footer }}
        initialValues={initialValue}
        getEmail={getEmail}
        hasSignatureByDefault={false}
      />
    )
  )
}

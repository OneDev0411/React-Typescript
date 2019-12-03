import { OAuthProvider } from 'constants/contacts'

import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { useRerenderOnChange } from 'hooks/use-rerender-on-change'
import { IAppState } from 'reducers'

import {
  getReplyAllRecipients,
  getReplyRecipients
} from './helpers/get-reply-recipients'
import { getReplyHtml } from './helpers/get-reply-html'
import { getForwardHtml } from './helpers/get-forward-html'
import { getReplySubject } from './helpers/get-reply-subject'
import { EmailResponseType } from '../EmailThread/types'
import { encodeContentIds } from '../EmailThread/helpers/encode-content-ids'
import { convertToAbsoluteAttachmentUrl } from '../EmailThread/helpers/convert-to-absolute-attachment-url'
import { SingleEmailComposeForm } from './SingleEmailComposeForm'
import { EmailFormValues } from './types'
import { isGoogleMessage, isMicrosoftMessage } from './helpers/type-guards'

interface Props {
  responseType: EmailResponseType
  email: IEmailThreadEmail
  fallbackCredential?: string
  onCancel: () => void
  onSent: (email: IEmailThreadEmail) => void
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        minHeight: '24.5rem'
      },
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
  fallbackCredential,
  onCancel,
  onSent
}: Props) {
  const classes = useStyles()

  const user = useSelector((state: IAppState) => state.user as IUser)

  const googleCredential = isGoogleMessage(email)
    ? email.google_credential
    : undefined
  const microsoftCredential = isMicrosoftMessage(email)
    ? email.microsoft_credential
    : undefined

  const initialValue = useMemo<EmailFormValues>((): EmailFormValues => {
    const { to, cc } =
      responseType === 'forward'
        ? { to: [], cc: [] }
        : responseType === 'replyAll'
        ? getReplyAllRecipients(email, '' /* FIXME(current) */)
        : getReplyRecipients(email)

    return {
      from: user,
      microsoft_credential: microsoftCredential,
      google_credential: googleCredential,
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
          ? email.attachments.map(attachment => ({
              url: attachment.url,
              name: attachment.name
            }))
          : [],
      subject: getReplySubject(responseType, email)
    }
  }, [email, googleCredential, microsoftCredential, responseType, user])

  const getHeaders = (emailInput: EmailFormValues) => {
    const fromType: OAuthProvider | null =
      (emailInput.google_credential && OAuthProvider.Google) ||
      (emailInput.microsoft_credential && OAuthProvider.Outlook) ||
      null

    const originType: OAuthProvider | null = googleCredential
      ? OAuthProvider.Google
      : microsoftCredential
      ? OAuthProvider.Outlook
      : null
    const originMatchesFrom = !originType || originType === fromType

    return {
      thread_id: originMatchesFrom ? email.thread_id : undefined,
      message_id: originMatchesFrom ? email.message_id : undefined,
      in_reply_to: email.internet_message_id
    }
  }
  const getEmail = useCallback(
    (emailInput: IEmailCampaignInput): IEmailCampaignInput => {
      // TODO maybe this can be moved to EmailComposeForm as a next step
      //  refactoring
      const html = encodeContentIds(email.attachments, emailInput.html)

      const inlineAttachments: IEmailAttachmentInput[] = email.attachments
        .filter(
          attachment => attachment.cid && html.includes(`cid:${attachment.cid}`)
        )
        .map(({ cid, contentType: type, isInline, name: filename, url }) => ({
          is_inline: isInline,
          url: convertToAbsoluteAttachmentUrl(url),
          content_id: cid
        }))

      const attachments = (emailInput.attachments || [])
        // filter out inline attachments
        .filter(
          attachment =>
            !inlineAttachments.some(item => item.url === attachment.url)
        )

      return {
        ...emailInput,
        html,
        attachments: attachments.concat(inlineAttachments)
      }
    },
    [email.attachments]
  )

  const shouldRender = useRerenderOnChange(responseType)

  // This filter is added in response to Saeed's request. Right now
  // we have some issues in replying with an account other than
  // the one by which the thread is started. We should remove
  // this filtering when this issue is resolved.
  // Note that if the thread is started from a rechat email (sent with Mailgun),
  // and we are replying to that starting email, it doesn't have owner,
  // and we use fallbackCredential which comes from the first non-rechat email
  // in that thread
  const forcedSender =
    googleCredential || microsoftCredential || fallbackCredential

  return (
    shouldRender && (
      <SingleEmailComposeForm
        onCancel={onCancel}
        onSent={onSent}
        classes={{ footer: classes.footer, root: classes.root }}
        initialValues={initialValue}
        preferredAccountId={fallbackCredential}
        getEmail={getEmail}
        headers={getHeaders}
        filterAccounts={account => !forcedSender || account.id === forcedSender}
        hasSignatureByDefault={false}
      />
    )
  )
}

import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { flow, uniq } from 'lodash'
import { shallowEqual } from 'recompose'

import { OAuthProvider } from 'constants/contacts'

import { useRerenderOnChange } from 'hooks/use-rerender-on-change'
import { IAppState } from 'reducers'

import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { parseEmailRecipient } from 'components/EmailRecipientsChipsInput/helpers/parse-email-recipient'

import { selectUser } from 'selectors/user'

import {
  getReplyAllRecipients,
  getReplyRecipients
} from './helpers/get-reply-recipients'
import { getReplyHtml } from './helpers/get-reply-html'
import { getForwardHtml } from './helpers/get-forward-html'
import { getReplySubject } from './helpers/get-reply-subject'
import { hasAccountSendPermission } from './helpers/has-account-send-permission'
import { EmailResponseType, EmailThreadEmail } from '../EmailThread/types'
import { encodeContentIds } from '../EmailThread/helpers/encode-content-ids'
import { SingleEmailComposeForm } from './SingleEmailComposeForm'
import { EmailFormValues } from './types'

interface Props {
  responseType: EmailResponseType
  email: EmailThreadEmail
  fallbackCredential?: string
  onCancel: () => void
  onSent: (email: IEmailCampaign) => void
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
  onCancel,
  onSent
}: Props) {
  const classes = useStyles()

  const user = useSelector((state: IAppState) => selectUser(state))
  const allConnectedAccounts = useSelector<IAppState, IOAuthAccount[]>(
    flow(state => state.contacts.oAuthAccounts, selectAllConnectedAccounts),
    shallowEqual
  )
  const initialValue = useMemo<EmailFormValues>((): EmailFormValues => {
    const ownerAccount = allConnectedAccounts.find(
      account => account.id === (email.microsoftId || email.googleId)
    )
    const { to, cc } =
      responseType === 'forward'
        ? { to: [], cc: [] }
        : responseType === 'replyAll'
        ? getReplyAllRecipients(email, ownerAccount ? ownerAccount.email : '')
        : getReplyRecipients(email)

    const orderedEmailRecipients = uniq(
      [
        ...email.to,
        ...email.cc,
        ...email.bcc,
        email.from,
        ...allConnectedAccounts.map(({ email }) => email)
      ].map(email => parseEmailRecipient(email).emailAddress)
    )
    const orderedSenderAccounts = allConnectedAccounts
      .filter(hasAccountSendPermission)
      .sort(
        (a, b) =>
          orderedEmailRecipients.indexOf(a.email) -
          orderedEmailRecipients.indexOf(b.email)
      )
    const fromAccount = orderedSenderAccounts[0]

    return {
      from: fromAccount || user,
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
      subject: getReplySubject(responseType, email.subject)
    }
  }, [allConnectedAccounts, email, responseType, user])

  const getHeaders = (emailInput: EmailFormValues) => {
    let fromType: OAuthProvider | null = null
    let originType: OAuthProvider | null = null

    if (email.googleId) {
      fromType = OAuthProvider.Google
      originType = OAuthProvider.Google
    } else if (email.microsoftId) {
      fromType = OAuthProvider.Outlook
      originType = OAuthProvider.Outlook
    }

    const originMatchesFrom = !originType || originType === fromType

    return {
      thread_id: originMatchesFrom ? email.threadId : undefined,
      message_id: originMatchesFrom ? email.messageId : undefined,
      in_reply_to: email.internetMessageId
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
        .map(({ cid, isInline, name, url }) => ({
          is_inline: isInline,
          url,
          name,
          content_id: cid
        }))

      const attachments = (emailInput.attachments || [])
        // filter out inline attachments
        .filter(
          attachment =>
            !inlineAttachments.some(
              item =>
                'url' in item &&
                'url' in attachment &&
                item.url === attachment.url
            )
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

  return (
    shouldRender && (
      <SingleEmailComposeForm
        onCancel={onCancel}
        onSent={onSent}
        classes={{ footer: classes.footer, root: classes.root }}
        initialValues={initialValue}
        getEmail={getEmail}
        headers={getHeaders}
        hasSignatureByDefault={false}
        disableMarketingTemplates
      />
    )
  )
}

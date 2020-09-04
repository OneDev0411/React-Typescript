import * as React from 'react'
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Avatar,
  Link,
  makeStyles,
  Paper,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import fecha from 'fecha'
import useBoolean from 'react-use/lib/useBoolean'
import { mdiReplyAllOutline, mdiReplyOutline, mdiAttachment } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { forwardOutlined } from 'components/SvgIcons/icons'
import { Iframe } from 'components/Iframe'
import CampaignStatus from 'components/CampaignStatus'

import { EmailItemHeaderActions } from './EmailItemHeaderActions'
import { EmailItemRecipients } from './EmailItemRecipients'
import { Attachment } from '../../EmailCompose/components/Attachment'
import { EmailResponseType, EmailThreadEmail } from '../types'
import { decodeContentIds } from '../helpers/decode-content-ids'
import { EmailResponseComposeForm } from '../../EmailCompose/EmailResponseComposeForm'
import { hasReplyAll } from '../../EmailCompose/helpers/has-reply-all'
import { EmailRecipient } from '../../EmailRecipient'
import { ThreeDotsButton } from '../../ThreeDotsButton'
import { trimEmailQuotedContent } from '../helpers/trimEmailQuotedContent'
import { updateEmailReadStatus } from '../helpers/update-email-read-status'
import getStatusFromCampaign from '../helpers/get-status-from-campaign'

interface Props {
  email: EmailThreadEmail
  collapsed: boolean

  /**
   * if not undefined, makes the item header clickable which toggles collapsed
   */
  onToggleCollapsed: undefined | ((collapsed: boolean) => void)

  /**
   * callback to be called when replied or forwarded
   */
  onEmailSent?: (email: IEmailCampaign) => void

  /**
   * If true, will show 'reply' and 'forward' buttons under email content
   */
  showBottomButtons?: boolean
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      // limit the stickiness of the header within the email thread item
      position: 'relative'
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 2,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2, 2.5)
    },
    emailSnippet: {
      color: theme.palette.grey[500]
    },
    actionButton: {
      marginRight: `${theme.spacing(1)}px`
    },
    avatar: {
      backgroundColor: theme.palette.divider,
      color: theme.palette.text.primary
    },
    campaignStatus: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'EmailThreadItem' }
)

export function EmailThreadItem({
  collapsed,
  email,
  onToggleCollapsed,
  showBottomButtons = false,
  onEmailSent = () => {},
  ...props
}: Props) {
  const classes = useStyles(props)

  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [trimQuotedContent, toggleTrimQuotedContent] = useBoolean(true)
  const [responseType, setResponseType] = useState<EmailResponseType>('reply')
  // const [followUpModalIsOpen, setFollowUpModalIsOpen] = useState(false)

  const openResponse = (type: EmailResponseType) => {
    setIsResponseOpen(true)
    setResponseType(type)
  }

  const emailBody = useMemo(
    () => decodeContentIds(email.attachments, email.htmlBody || ''),
    [email]
  )

  const trimmedEmailBody = useMemo(
    () => emailBody && trimEmailQuotedContent(emailBody),
    [emailBody]
  )

  const isToggleQuotedContentVisible = trimmedEmailBody !== emailBody
  const hasNonInlineAttachments =
    email.attachments.filter(attachment => !attachment.isInline).length > 0
  const hasCampaignStatus =
    !!email.campaign?.google_credential ||
    !!email.campaign?.microsoft_credential
  const campaignStatus = email.campaign && getStatusFromCampaign(email.campaign)

  return (
    <div className={classes.root}>
      {/* header */}
      <div
        className={classes.header}
        role={onToggleCollapsed && 'button'}
        onClick={onToggleCollapsed && (() => onToggleCollapsed(!collapsed))}
      >
        <Box mr={2}>
          <Avatar alt={email.from} sizes="32" className={classes.avatar}>
            {email.from.substring(0, 1).toUpperCase()}
          </Avatar>
        </Box>
        <Box flex={1} mr={2} overflow="hidden">
          <Typography variant="body2" noWrap>
            <EmailRecipient recipient={email.from} />
          </Typography>
          <Typography
            variant="body2"
            noWrap
            classes={{ root: classes.emailSnippet }}
          >
            {collapsed ? email.snippet : <EmailItemRecipients email={email} />}
          </Typography>
        </Box>
        <Box alignSelf="start">
          <Box display="flex" alignItems="center" height="1.25rem">
            {hasNonInlineAttachments && (
              <SvgIcon path={mdiAttachment} rightMargined />
            )}
            {hasCampaignStatus && (
              <CampaignStatus
                status={campaignStatus!}
                className={classes.campaignStatus}
              />
            )}
            <Typography color="textSecondary" variant="caption">
              {/* I think we should conditionally show year, if it's not current year. fecha doesn't support such formatting I guess */}
              {fecha.format(email.date, 'MMM DD, hh:mm A')}
            </Typography>
            {collapsed || !email.threadId ? null : (
              <EmailItemHeaderActions
                email={email}
                onReply={() => openResponse('reply')}
                onReplyAll={() => openResponse('replyAll')}
                onForward={() => openResponse('forward')}
                onChangeReadStatus={() =>
                  updateEmailReadStatus(email, !email.isRead)
                }
              />
            )}
          </Box>
        </Box>
      </div>
      {/* content */}
      {!collapsed && (
        <>
          <Box p={2} pl={9} overflow="hidden">
            <Iframe
              title="Email body"
              height="400px"
              srcDoc={trimQuotedContent ? trimmedEmailBody : emailBody}
            />
            {isToggleQuotedContentVisible && (
              <>
                <Tooltip
                  title={
                    trimQuotedContent
                      ? 'Show trimmed content'
                      : 'Hide expanded content'
                  }
                >
                  <ThreeDotsButton onClick={toggleTrimQuotedContent} />
                </Tooltip>
                <br />
              </>
            )}
            <br />
            {email.attachments.map(attachment => (
              <Attachment key={attachment.id} fullWidth={false}>
                <Link target="_blank" href={attachment.url}>
                  {attachment.name}
                </Link>
              </Attachment>
            ))}

            {(showBottomButtons || isResponseOpen) && email.threadId && (
              <Box my={1}>
                <Button
                  className={classes.actionButton}
                  onClick={() => openResponse('reply')}
                  variant="outlined"
                  color={
                    isResponseOpen && responseType === 'reply'
                      ? 'primary'
                      : undefined
                  }
                >
                  <SvgIcon path={mdiReplyOutline} rightMargined />
                  Reply
                </Button>
                {hasReplyAll(email) && (
                  <Button
                    className={classes.actionButton}
                    onClick={() => openResponse('replyAll')}
                    variant="outlined"
                    color={
                      isResponseOpen && responseType === 'replyAll'
                        ? 'primary'
                        : undefined
                    }
                  >
                    <SvgIcon path={mdiReplyAllOutline} rightMargined />
                    Reply All
                  </Button>
                )}

                <Button
                  className={classes.actionButton}
                  onClick={() => openResponse('forward')}
                  variant="outlined"
                  color={
                    isResponseOpen && responseType === 'forward'
                      ? 'primary'
                      : undefined
                  }
                >
                  <SvgIcon path={forwardOutlined} rightMargined />
                  Forward
                </Button>
              </Box>
            )}
            {isResponseOpen && (
              <Paper elevation={10}>
                <EmailResponseComposeForm
                  email={email}
                  responseType={responseType}
                  onCancel={() => {
                    setIsResponseOpen(false)
                  }}
                  onSent={email => {
                    setIsResponseOpen(false)
                    onEmailSent(email)
                  }}
                />
              </Paper>
            )}
          </Box>
        </>
      )}
    </div>
  )
}

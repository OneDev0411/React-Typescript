import * as React from 'react'
import { useState } from 'react'

import {
  Box,
  Button,
  createStyles,
  Link,
  makeStyles,
  Paper,
  Theme,
  Typography
} from '@material-ui/core'
import fecha from 'fecha'
import classNames from 'classnames'

import { Iframe } from 'components/Iframe'

import config from '../../../../../config/public'
import Avatar from '../../Avatar'
import IconAttachment from '../../SvgIcons/Attachment/IconAttachment'
import { useIconStyles } from '../../../../styles/use-icon-styles'
import { EmailItemHeaderActions } from './EmailItemHeaderActions'
import { EmailItemRecipients } from './EmailItemRecipients'
import IconReply from '../../SvgIcons/Reply/IconReply'
import IconForward from '../../SvgIcons/Forward/IconForward'
import { Attachment } from '../../EmailCompose/components/Attachment'
import { EmailResponseType } from '../types'
import EmailThreadComposeForm from '../../EmailCompose/EmailThreadComposeForm'

interface Props {
  email: IEmailThreadEmail
  collapsed: boolean

  /**
   * if not undefined, makes the item header clickable which toggles collapsed
   */
  onToggleCollapsed: undefined | ((collapsed: boolean) => void)

  /**
   * callback to be called when replied or forwarded
   */
  onEmailSent?: (email: IEmailThreadEmail) => void

  /**
   * If true, will show 'reply' and 'forward' buttons under email content
   */
  showBottomButtons?: boolean

  /**
   * Default value of the email `from`. owner is null in rechat emails (send
   * via mailgun), and therefore default `from` may not be extracted based
   * on email in these cases. So it's passed from the thread.
   */
  defaultFrom?: string
}

const styles = (theme: Theme) =>
  createStyles({
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
    actionButton: {
      marginRight: `${theme.spacing(1)}px`
    },
    composeWrapper: {
      padding: theme.spacing(0, 3)
    }
  })
const useStyles = makeStyles(styles, { name: 'EmailThreadItem' })

export function EmailThreadItem({
  collapsed,
  email,
  onToggleCollapsed,
  showBottomButtons = false,
  defaultFrom,
  onEmailSent = () => {},
  ...props
}: Props) {
  const iconClasses = useIconStyles()
  const classes = useStyles(props)

  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [responseType, setResponseType] = useState<EmailResponseType>('reply')

  const openReply = () => {
    setIsResponseOpen(true)
    setResponseType('reply')
  }
  const openForward = () => {
    setIsResponseOpen(true)
    setResponseType('forward')
  }

  const iconClassName = classNames(iconClasses.rightMargin, iconClasses.small)

  return (
    <div className={classes.root}>
      {/* header */}
      <div
        className={classes.header}
        role={onToggleCollapsed && 'button'}
        onClick={onToggleCollapsed && (() => onToggleCollapsed(!collapsed))}
      >
        <Box mr={2}>
          <Avatar title={email.from} />
        </Box>
        <Box flex={1} mr={2} overflow="hidden">
          <Typography style={{ lineHeight: 1.3 }}>{email.from}</Typography>
          <Typography color="textSecondary" noWrap>
            {collapsed ? email.snippet : <EmailItemRecipients email={email} />}
          </Typography>
        </Box>
        <Box alignSelf="start">
          <Box display="flex" alignItems="center" height="1.25rem">
            {email.has_attachments && (
              <IconAttachment
                style={{ transform: 'rotate(90deg)' }}
                className={classNames(
                  iconClasses.small,
                  iconClasses.rightMargin
                )}
              />
            )}
            <Typography color="textSecondary" variant="caption">
              {/* I think we should conditionally show year, if it's not current year. fecha doesn't support such formatting I guess */}
              {fecha.format(new Date(email.message_date), 'MMM DD, hh:mm A')}
            </Typography>
            {collapsed ? null : (
              <EmailItemHeaderActions
                onReply={openReply}
                onForward={openForward}
              />
            )}
          </Box>
        </Box>
      </div>
      {/* content */}
      {!collapsed && (
        <>
          <Box p={2} pl={9}>
            <Iframe title="Email body" srcDoc={email.html_body || ''} />

            {email.attachments.map(attachment => (
              <Attachment key={attachment.id} fullWidth={false}>
                {/* FIXME: url */}
                <Link
                  target="_blank"
                  href={`${config.api_url}/${attachment.url}`}
                >
                  {attachment.name}
                </Link>
              </Attachment>
            ))}

            {showBottomButtons && (
              <Box my={1}>
                <Button
                  className={classes.actionButton}
                  onClick={openReply}
                  color={
                    isResponseOpen && responseType === 'reply'
                      ? 'primary'
                      : undefined
                  }
                >
                  <IconReply className={iconClassName} />
                  Reply
                </Button>
                <Button
                  className={classes.actionButton}
                  onClick={openForward}
                  color={
                    isResponseOpen && responseType === 'forward'
                      ? 'primary'
                      : undefined
                  }
                >
                  <IconForward className={iconClassName} />
                  Forward
                </Button>
              </Box>
            )}
            {isResponseOpen && (
              <Paper elevation={10} className={classes.composeWrapper}>
                <EmailThreadComposeForm
                  email={email}
                  responseType={responseType}
                  onCancel={() => {
                    setIsResponseOpen(false)
                  }}
                  defaultFrom={defaultFrom}
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

import * as React from 'react'
import { useState } from 'react'

import {
  Box,
  Button,
  createStyles,
  Link,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import fecha from 'fecha'
import classNames from 'classnames'

import { Iframe } from 'components/Iframe'

import Avatar from '../../Avatar'
import IconAttachment from '../../SvgIcons/Attachment/IconAttachment'
import { useIconStyles } from '../../../../styles/use-icon-styles'
import { EmailItemHeaderActions } from './EmailItemHeaderActions'
import { EmailItemRecipients } from './EmailItemRecipients'
import IconReply from '../../SvgIcons/Reply/IconReply'
import IconForward from '../../SvgIcons/Forward/IconForward'
import { Attachment } from '../../EmailCompose/components/Attachment'
import { getAttachmentUrl } from '../helpers/get-attachment-url'

type ResponseType = 'reply' | 'forward'

interface Props {
  email: IEmailThreadEmail
  collapsed: boolean
  /**
   * if not undefined, makes the item header clickable which toggles collapsed
   */
  onToggleCollapsed: undefined | ((collapsed: boolean) => void)
  /**
   * If true, will show 'reply' and 'forward' buttons under email content
   */
  showBottomButtons?: boolean
}

const styles = (theme: Theme) =>
  createStyles({
    header: {
      position: 'sticky',
      backgroundColor: theme.palette.background.paper,
      top: 0,
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2)
    },
    actionButton: {
      marginRight: `${theme.spacing(1)}px`
    }
  })
const useStyles = makeStyles(styles, { name: 'EmailThreadItem' })

export function EmailThreadItem({
  collapsed,
  email,
  onToggleCollapsed,
  showBottomButtons = false,
  ...props
}: Props) {
  const iconClasses = useIconStyles()
  const classes = useStyles(props)

  const [isResponseOpen, setResponseOpen] = useState(false)
  const [responseType, setResponseType] = useState<ResponseType>('reply')

  const openReply = () => {
    setResponseOpen(true)
    setResponseType('reply')
  }
  const openForward = () => {
    setResponseOpen(true)
    setResponseType('forward')
  }

  const iconClassName = classNames(iconClasses.rightMargin, iconClasses.small)

  return (
    <>
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
          <Box p={2} pl={8}>
            <Iframe title="Email body" srcDoc={email.html_body} />

            {email.attachments.map(attachment => (
              <Attachment key={attachment.id} fullWidth={false}>
                {/* FIXME: url */}
                <Link
                  target="_blank"
                  href={getAttachmentUrl(email, attachment)}
                >
                  {attachment.name}
                </Link>
              </Attachment>
            ))}

            {showBottomButtons && (
              <div>
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
              </div>
            )}
          </Box>
        </>
      )}
    </>
  )
}

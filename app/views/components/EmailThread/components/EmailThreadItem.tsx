import * as React from 'react'

import { Box, Typography } from '@material-ui/core'
import fecha from 'fecha'
import classNames from 'classnames'

import { Iframe } from 'components/Iframe'

import Avatar from '../../Avatar'
import IconAttachment from '../../SvgIcons/Attachment/IconAttachment'
import { useIconStyles } from '../../../../styles/use-icon-styles'
import { EmailItemHeaderActions } from './EmailItemHeaderActions'
import { EmailItemRecipientsMenu } from './EmailItemRecipientsMenu'

interface Props {
  email: IEmailThreadEmail
  collapsed: boolean
}

export function EmailThreadItem({ collapsed, email }: Props) {
  const iconClasses = useIconStyles()

  const onReply = () => {}
  const onForward = () => {}

  return (
    <>
      <Box display="flex" alignItems="center" p={2}>
        <Box mr={2}>
          <Avatar title={email.from} />
        </Box>
        <Box flex={1} mt={1} mr={2} overflow="hidden">
          <Typography style={{ lineHeight: 1.3 }}>{email.from}</Typography>
          <Typography color="textSecondary" noWrap>
            {collapsed ? (
              email.snippet
            ) : (
              <EmailItemRecipientsMenu email={email} />
            )}
          </Typography>
        </Box>
        <Box alignSelf="start">
          <Box display="flex" alignItems="center">
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
              <EmailItemHeaderActions onReply={onReply} onForward={onForward} />
            )}
          </Box>
        </Box>
      </Box>
      {!collapsed && (
        <Box p={2} pl={8}>
          <Iframe title="Email body" srcDoc={email.html_body} />
        </Box>
      )}
    </>
  )
}

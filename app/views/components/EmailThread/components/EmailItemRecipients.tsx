import React, { Fragment, useState, useRef, ReactNode } from 'react'
import { Typography, Theme, Tooltip, Popover } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { mdiMenuDown } from '@mdi/js'
import fecha from 'fecha'
import classNames from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { EmailThreadEmail } from '../types'
import { EmailRecipient } from '../../EmailRecipient'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  detailsButton: {
    marginLeft: theme.spacing(0.5),
    width: theme.spacing(2),
    height: theme.spacing(2),
    border: '1px solid transparent',
    borderRadius: 4,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    flex: '0 0 auto',
    '&:hover': {
      borderColor: theme.palette.grey[500],
      backgroundColor: theme.palette.action.hover
    }
  },
  detailsButtonActive: {
    borderColor: theme.palette.grey[500]
  },
  detailsIcon: {
    position: 'relative',
    left: `calc(${theme.spacing(-0.5)}px - 1px)`, // 1px for the parent element boarder
    top: `calc(${theme.spacing(-0.5)}px - 1px)` // 1px for the parent element boarder
  },
  detailsPaper: {
    padding: theme.spacing(3),
    maxWidth: theme.spacing(85)
  },
  detail: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0
    }
  },
  detailLabel: {
    width: theme.spacing(9),
    flexShrink: 0,
    textAlign: 'right',
    marginRight: theme.spacing(3),
    color: theme.palette.grey[500]
  },
  detailContent: {
    whiteSpace: 'pre-line'
  }
}))

interface Props {
  email: EmailThreadEmail
}

export function EmailItemRecipients({ email }: Props) {
  const { from, to = [], cc = [], bcc = [], date, subject } = email

  const detailsElementRef = useRef<HTMLDivElement>(null)
  const [detailsAreVisible, setDetailsAreVisible] = useState(false)

  const classes = useStyles()

  function renderRecipients(recipients: string[], inline?: boolean) {
    return recipients.map((recipient, index) => (
      <Fragment key={recipient + index}>
        <EmailRecipient recipient={recipient} />
        {index < recipients.length - 1 && `,${inline ? ' ' : '\n'}`}
      </Fragment>
    ))
  }

  function renderDetail(label: string, visible: boolean, content: ReactNode) {
    if (!visible) {
      return null
    }

    return (
      <div className={classes.detail}>
        <div className={classes.detailLabel}>
          <Typography variant="body2">{label}:</Typography>
        </div>
        <Typography variant="body2" className={classes.detailContent}>
          {content}
        </Typography>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <Typography variant="body2" noWrap>
        to {renderRecipients(to, true)}
        {cc.length > 0 ? (
          <>
            {', cc: '}
            {renderRecipients(cc, true)}
          </>
        ) : null}
        {bcc.length > 0 ? (
          <>
            {', bcc: '}
            {renderRecipients(bcc, true)}
          </>
        ) : null}
      </Typography>
      <Tooltip title="Show details">
        <div
          ref={detailsElementRef}
          className={classNames(
            classes.detailsButton,
            detailsAreVisible && classes.detailsButtonActive
          )}
          onClick={event => {
            event.stopPropagation()
            setDetailsAreVisible(true)
          }}
        >
          <SvgIcon path={mdiMenuDown} className={classes.detailsIcon} />
        </div>
      </Tooltip>
      <Popover
        open={detailsAreVisible}
        anchorEl={detailsElementRef.current}
        classes={{ paper: classes.detailsPaper }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        onClose={(event: any) => {
          typeof event.stopPropagation === 'function' && event.stopPropagation()
          setDetailsAreVisible(false)
        }}
        PaperProps={{
          onClick: event => event.stopPropagation()
        }}
      >
        {renderDetail('from', true, <EmailRecipient recipient={from} />)}
        {renderDetail('to', to.length > 0, renderRecipients(to))}
        {renderDetail('cc', cc.length > 0, renderRecipients(cc))}
        {renderDetail('bcc', bcc.length > 0, renderRecipients(bcc))}
        {renderDetail('date', true, fecha.format(date, 'MMM DD, hh:mm A'))}
        {renderDetail('subject', !!subject, subject)}
        {renderDetail(
          'mailed-by',
          true,
          email.googleId ? 'Gmail' : email.microsoftId ? 'Outlook' : 'Mailgun'
        )}
      </Popover>
    </div>
  )
}

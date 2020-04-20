import React from 'react'
import { Box, IconButton } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import SendEmailButton from 'components/SendEmailButton'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import EmailIcon from 'components/SvgIcons/EmailOutlined/IconEmailOutlined'
import BirthDayIcon from 'components/SvgIcons/Birthday/IconBirthday'

import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import Chat from '../../../components/ChatButton'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      button: {
        '&[disabled] svg': {
          fill: theme.palette.action.disabled
        }
      }
    }),
  { name: 'HeaderMenu' }
)

interface Props {
  contact: INormalizedContact
}

export default function Menu({ contact }: Props) {
  const classes = useStyles()

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center" mb={1}>
      {/*
       // @ts-ignore js component */}
      <SendEmailButton
        recipients={normalizeContactsForEmailCompose([contact])}
        render={({ onClick, testId }) => (
          <IconButton
            onClick={onClick}
            data-test={testId}
            className={classes.button}
          >
            <EmailIcon />
          </IconButton>
        )}
      />

      <Chat contact={contact} />

      {/*
       // @ts-ignore js component */}
      <SendContactCard
        contact={contact}
        mediums="Email"
        buttonRenderrer={({ disabled, onClick }) => (
          <IconButton
            className={classes.button}
            disabled={disabled}
            onClick={onClick}
          >
            <BirthDayIcon />
          </IconButton>
        )}
      />
    </Box>
  )
}

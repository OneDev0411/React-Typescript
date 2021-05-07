import React from 'react'
import { Box, IconButton } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { mdiGiftOutline, mdiEmailOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import SendEmailButton from 'components/SendEmailButton'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import AddNote from './AddNote'
import AddEvent from './AddEvent'
import Chat from '../../../components/ChatButton'
import { Props } from '..'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        display: 'flex',
        alignItems: 'center'
      },
      shortcutContainer: {
        '& button:not(:last-child)': {
          marginRight: theme.spacing(1)
        }
      },
      button: {
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.action.disabledBackground}`,
        '&[disabled] svg': {
          fill: theme.palette.action.disabled
        }
      },
      actionContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(1),
        '& button:not(:last-child)': { marginRight: theme.spacing(1) }
      }
    }),
  { name: 'ContactProfileHeaderActions' }
)

export const Actions = ({
  contact,
  handleCreateNote
}: Omit<Props, 'onTagChange'>) => {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Box className={classes.shortcutContainer}>
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
              <SvgIcon path={mdiEmailOutline} size={muiIconSizes.medium} />
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
              onClick={onClick}
              disabled={disabled}
              className={classes.button}
            >
              <SvgIcon path={mdiGiftOutline} size={muiIconSizes.medium} />
            </IconButton>
          )}
        />
      </Box>
      <Box className={classes.actionContainer}>
        <AddNote contactId={contact.id} onCreateNote={handleCreateNote} />
        <AddEvent contact={contact} />
      </Box>
    </Box>
  )
}

import React from 'react'
import {
  Box,
  Tooltip,
  IconButton,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

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
        alignItems: 'center',
        minWidth: '371px'
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
        <SendEmailButton
          recipients={normalizeContactsForEmailCompose([contact])}
          render={({ onClick, testId }) => (
            <Tooltip title="Send Email">
              <IconButton
                onClick={onClick}
                data-test={testId}
                className={classes.button}
              >
                <SvgIcon path={mdiEmailOutline} size={muiIconSizes.medium} />
              </IconButton>
            </Tooltip>
          )}
        />
        <Chat contact={contact} />
        <SendContactCard
          contact={contact}
          mediums="Email"
          buttonRenderrer={({ disabled, onClick }) => (
            <Tooltip title="Send a Card">
              <IconButton
                onClick={onClick}
                disabled={disabled}
                className={classes.button}
              >
                <SvgIcon path={mdiGiftOutline} size={muiIconSizes.medium} />
              </IconButton>
            </Tooltip>
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

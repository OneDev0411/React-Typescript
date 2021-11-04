import React from 'react'

import {
  Tooltip,
  IconButton,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import { mdiGiftOutline, mdiEmailOutline } from '@mdi/js'

import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import SendEmailButton from 'components/SendEmailButton'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import { Props } from '..'
import Chat from '../../../components/ChatButton'

import AddEvent from './AddEvent'
import AddNote from './AddNote'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        display: 'flex',
        alignItems: 'center'
      },
      shortcutContainer: {
        display: 'flex',
        columnGap: theme.spacing(1)
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
        marginLeft: theme.spacing(1.5),
        columnGap: theme.spacing(1)
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
    <div className={classes.container}>
      <div className={classes.shortcutContainer}>
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

        <Chat contact={contact} size={muiIconSizes.medium} />

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
      </div>
      <div className={classes.actionContainer}>
        <AddNote contactId={contact.id} onCreateNote={handleCreateNote} />
        <AddEvent contact={contact} />
      </div>
    </div>
  )
}

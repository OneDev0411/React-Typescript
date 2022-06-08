import { useState } from 'react'

import {
  Tooltip,
  IconButton,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import { mdiGiftOutline, mdiEmailOutline } from '@mdi/js'

import { ReminderDialog } from '@app/views/components/ReminderDialog'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import SendEmailButton from 'components/SendEmailButton'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import { Props } from '..'
import { ManageRelationship } from '../../../components/ManageRelationship'
import { TOUCH_REMINDER_HINT_DISMISSED_SETTINGS_KEY } from '../../../constants'

import AddEvent from './AddEvent'
import AddNote from './AddNote'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5)
      },
      shortcutContainer: {
        display: 'flex',
        gap: theme.spacing(1)
      },
      shortcutIconButton: {
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.action.disabledBackground}`,
        '&[disabled] svg': {
          fill: theme.palette.action.disabled
        }
      },
      actionContainer: {
        justifyContent: 'flex-end',
        minWidth: '200px',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
      }
    }),
  { name: 'ContactProfileHeaderActions' }
)

export const Actions = ({
  contact,
  onCreateNote,
  onCreateEvent,
  onUpdateTouchFreq
}: Omit<Props, 'contactChangeCallback'>) => {
  const classes = useStyles()

  const [manageRelationshipRef, setManageRelationshipRef] =
    useState<Nullable<HTMLDivElement>>(null)

  const shouldShowReminderDialog = contact.touch_freq === null

  return (
    <div className={classes.container}>
      {false && (
        <div className={classes.shortcutContainer}>
          <SendEmailButton
            recipients={normalizeContactsForEmailCompose([contact])}
            render={({ onClick, testId }) => (
              <Tooltip title="Send Email">
                <IconButton
                  onClick={onClick}
                  data-test={testId}
                  className={classes.shortcutIconButton}
                >
                  <SvgIcon path={mdiEmailOutline} size={muiIconSizes.medium} />
                </IconButton>
              </Tooltip>
            )}
          />

          <SendContactCard
            contact={contact}
            mediums="Email"
            buttonRenderrer={({ disabled, onClick }) => (
              <Tooltip title="Send a Card">
                <IconButton
                  onClick={onClick}
                  disabled={disabled}
                  className={classes.shortcutIconButton}
                >
                  <SvgIcon path={mdiGiftOutline} size={muiIconSizes.medium} />
                </IconButton>
              </Tooltip>
            )}
          />
        </div>
      )}
      <div ref={setManageRelationshipRef} className={classes.actionContainer}>
        <ManageRelationship
          value={contact.touch_freq || null}
          onChange={onUpdateTouchFreq}
        />
        {false && (
          <>
            <AddNote contactId={contact.id} onCreateNote={onCreateNote} />
            <AddEvent contact={contact} callback={onCreateEvent} />
          </>
        )}
      </div>
      {shouldShowReminderDialog && (
        <ReminderDialog
          userSettingsKey={TOUCH_REMINDER_HINT_DISMISSED_SETTINGS_KEY}
          anchorEl={manageRelationshipRef}
          title="Setup how frequently you want to be in touch with this customer. We will remind you next time"
        />
      )}
    </div>
  )
}

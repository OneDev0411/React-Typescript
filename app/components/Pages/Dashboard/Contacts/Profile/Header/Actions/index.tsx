import { useState } from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core'

import { ReminderDialog } from '@app/views/components/ReminderDialog'

import { Props } from '..'
import { ManageRelationship } from '../../../components/ManageRelationship'
import { TOUCH_REMINDER_HINT_DISMISSED_SETTINGS_KEY } from '../../../constants'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5)
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
  onUpdateTouchFreq
}: Omit<Props, 'contactChangeCallback'>) => {
  const classes = useStyles()

  const [manageRelationshipRef, setManageRelationshipRef] =
    useState<Nullable<HTMLDivElement>>(null)

  const shouldShowReminderDialog = contact.touch_freq === null

  return (
    <div className={classes.container}>
      <div ref={setManageRelationshipRef} className={classes.actionContainer}>
        <ManageRelationship
          value={contact.touch_freq || null}
          onChange={onUpdateTouchFreq}
        />
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

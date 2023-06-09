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
}: Omit<Props, 'contactChangeCallback' | 'onChangeAvatar'>) => {
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
          title="Configure the auto reminder for how often you want to reach this contact. The auto reminder will notify you when it's time to reach out again."
        />
      )}
    </div>
  )
}

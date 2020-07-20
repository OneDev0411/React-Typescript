import React, { useState } from 'react'
import { mdiDotsVertical } from '@mdi/js'
import { MenuItem, IconButton, makeStyles, Theme } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { addNotification } from 'reapop'

import { updateChecklist } from 'actions/deals'

import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      marginLeft: theme.spacing(1)
    }
  }),
  {
    name: 'ChecklistOptionsMenu'
  }
)

interface Props {
  deal: IDeal
  checklist: IDealChecklist
  isBackOffice: boolean
}

export function FolderOptionsMenu({ deal, checklist, isBackOffice }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateChecklist = async (data: object, close: () => void) => {
    setIsSaving(true)

    try {
      await dispatch(
        updateChecklist(deal.id, checklist.id, {
          ...checklist,
          ...data
        })
      )
    } catch (e) {
      addNotification({
        message: 'Something bad happened. please try again',
        status: 'error'
      })
    } finally {
      dispatch(
        addNotification({
          message: 'The checklist is updated',
          status: 'success'
        })
      )

      setIsSaving(false)
      close()
    }
  }

  if (
    !isBackOffice ||
    (!checklist.is_terminatable && !checklist.is_deactivatable)
  ) {
    return null
  }

  return (
    <BaseDropdown
      renderDropdownButton={props => (
        <IconButton size="small" {...props} className={classes.root}>
          <SvgIcon path={mdiDotsVertical} />
        </IconButton>
      )}
      renderMenu={({ close }) => (
        <div>
          {checklist.is_terminatable && (
            <MenuItem
              disabled={isSaving}
              onClick={() => {
                handleUpdateChecklist(
                  {
                    is_terminated: !checklist.is_terminated
                  },
                  close
                )
              }}
            >
              {checklist.is_terminated ? 'Active' : 'Terminate'}
            </MenuItem>
          )}

          {checklist.is_deactivatable && (
            <MenuItem
              disabled={isSaving}
              onClick={() => {
                handleUpdateChecklist(
                  {
                    is_deactivated: !checklist.is_deactivated
                  },
                  close
                )
              }}
            >
              {checklist.is_deactivated
                ? 'Make this a primary offer'
                : 'Make this a back up offer'}
            </MenuItem>
          )}
        </div>
      )}
    />
  )
}

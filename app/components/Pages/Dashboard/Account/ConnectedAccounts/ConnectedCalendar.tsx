import React, { useState } from 'react'
import { addNotification as notify } from 'reapop'
import { useDispatch } from 'react-redux'

import {
  Popover,
  MenuItem,
  Checkbox,
  Button,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { getUserCalendars } from 'models/user/get-calendars'
import LoadingContainer from 'components/LoadingContainer'
import { configCalendars } from 'models/user/config-calendars'

interface Props {
  gcid: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdownToggleButton: {
      marginRight: theme.spacing(1)
    },
    buttonContainer: {
      padding: theme.spacing(1, 2)
    }
  })
)

export function ConnectedCalendar({ gcid }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [list, setCalendarsList] = useState<IGoogleCalendars | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleLoadCalendar = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (event) {
      setAnchorEl(event.currentTarget)
    }

    try {
      setIsLoading(true)

      const list = await getUserCalendars(gcid)

      setIsLoading(false)
      setCalendarsList(list)
    } catch (anchorEl) {
      setIsLoading(false)
    }
  }

  const handleCloseMenu = () => setAnchorEl(null)

  const handleToggleCalendarItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: IGoogleCalendarItem
  ) => {
    const selected = e.target.checked

    if (selected) {
      setSelectedItems([...selectedItems, item.id])
    } else {
      setSelectedItems(selectedItems.filter(index => index !== item.id))
    }
  }

  const handleApplyConfig = async () => {
    const toSync = selectedItems
    const toStopSync = list!.calendars
      .filter(item => selectedItems.includes(item.id) === false)
      .map(item => item.id)

    try {
      setIsSaving(true)
      await configCalendars(gcid, { toSync, toStopSync })

      dispatch(
        notify({
          status: 'success',
          message: 'The changes have been saved'
        })
      )

      setIsSaving(false)
      setAnchorEl(null)
    } catch (e) {
      setIsSaving(false)

      dispatch(
        notify({
          status: 'error',
          message: 'Could not save the changes. please try again.'
        })
      )
    }
  }

  return (
    <>
      <DropdownToggleButton
        variant="outlined"
        size="small"
        className={classes.dropdownToggleButton}
        onClick={handleLoadCalendar}
      >
        Config Calendar
      </DropdownToggleButton>

      <Popover
        id={anchorEl ? 'calendar-config-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        style={{ zIndex: 10 }}
      >
        {isLoading && (
          <LoadingContainer size="3em" style={{ margin: '0.5rem 3rem' }} />
        )}
        {!isLoading && list && (
          <>
            {list.calendars.map(item => (
              <MenuItem key={item.id}>
                <Checkbox
                  color="primary"
                  onChange={e => handleToggleCalendarItem(e, item)}
                />
                {item.name}
              </MenuItem>
            ))}

            <div className={classes.buttonContainer}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                disabled={isSaving}
                onClick={handleApplyConfig}
              >
                {isSaving ? 'Saving...' : 'Apply'}
              </Button>
            </div>
          </>
        )}
      </Popover>
    </>
  )
}

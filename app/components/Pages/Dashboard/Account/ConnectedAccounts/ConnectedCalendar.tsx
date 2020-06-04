import React, { useState } from 'react'
import { addNotification } from 'reapop'
import { useDispatch } from 'react-redux'

import {
  Theme,
  Popover,
  MenuItem,
  Checkbox,
  Button,
  Tooltip,
  FormControlLabel
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { getUserCalendars } from 'models/user/get-calendars'
import LoadingContainer from 'components/LoadingContainer'
import { configCalendars } from 'models/user/config-calendars'
import IconInfoOutline from 'components/SvgIcons/InfoOutline/IconInfoOutline'

interface Props {
  gcid: string
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    dropdownToggleButton: {
      marginRight: theme.spacing(1)
    },
    buttonContainer: {
      padding: theme.spacing(1, 2)
    },
    infoIcon: {
      fill: theme.palette.divider
    }
  }),
  { name: 'ConnectedCalendar' }
)

export default function ConnectedCalendar({ gcid }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [userCalendars, setUserCalendars] = useState<IGoogleCalendars | null>(
    null
  )
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleLoadCalendar = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget)

    try {
      setIsLoading(true)

      const userCalendars = await getUserCalendars(gcid)
      const selectedItemIds = userCalendars.calendars
        .filter(({ alreadySynced }) => alreadySynced)
        .map(({ id }) => id)

      setUserCalendars(userCalendars)
      setSelectedItemIds(selectedItemIds)
      setIsLoading(false)
    } catch (anchorEl) {
      setIsLoading(false)
    }
  }

  const handleCloseMenu = () => setAnchorEl(null)

  const handleToggleCalendarItem = (
    item: IGoogleCalendarItem,
    selected: boolean
  ) => {
    if (selected) {
      setSelectedItemIds([...selectedItemIds, item.id])
    } else {
      setSelectedItemIds(selectedItemIds.filter(index => index !== item.id))
    }
  }

  const handleApplyConfig = async () => {
    const toSync = selectedItemIds
    const toStopSync = userCalendars!.calendars
      .filter(({ id }) => !selectedItemIds.includes(id))
      .map(({ id }) => id)

    try {
      setIsSaving(true)

      await configCalendars(gcid, { toSync, toStopSync })

      dispatch(
        addNotification({
          status: 'success',
          message: 'The changes have been saved'
        })
      )

      setIsSaving(false)
      setAnchorEl(null)
    } catch (e) {
      setIsSaving(false)

      dispatch(
        addNotification({
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
        {!isLoading && userCalendars && (
          <>
            {userCalendars.calendars.map(item => (
              <MenuItem key={item.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={selectedItemIds.includes(item.id)}
                      onChange={(_, checked) =>
                        handleToggleCalendarItem(item, checked)
                      }
                    />
                  }
                  label={item.name}
                />
                {item.description && (
                  <Tooltip title={item.description}>
                    <IconInfoOutline className={classes.infoIcon} />
                  </Tooltip>
                )}
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

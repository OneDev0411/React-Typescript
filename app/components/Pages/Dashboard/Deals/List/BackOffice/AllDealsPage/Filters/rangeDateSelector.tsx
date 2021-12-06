import { useCallback, useRef, useState } from 'react'

import {
  Button,
  Grid,
  makeStyles,
  Popover,
  PopoverProps,
  TextField,
  Typography
} from '@material-ui/core'
import { format } from 'date-fns'
import DayPicker from 'react-day-picker/DayPicker'

import { DATE_FORMAT } from '../../constants'
import { TDateRange } from '../../types'

export const useStyles = makeStyles(
  theme => ({
    to: {
      textAlign: 'center',
      padding: theme.spacing(2)
    },
    footerResetButton: {
      marginTop: theme.spacing(-2),
      '&:hover, &:focus': {
        backgroundColor: 'transparent'
      }
    },
    rangeDatePicker: {
      '& .DayPicker-Day': {
        borderRadius: '0 !important'
      },
      '& .DayPicker-Day--start': {
        borderTopLeftRadius: '50% !important',
        borderBottomLeftRadius: '50% !important'
      },
      '& .DayPicker-Day--end': {
        borderTopRightRadius: '50% !important',
        borderBottomRightRadius: '50% !important'
      }
    }
  }),
  { name: 'RangeDateSelector' }
)

interface Props {
  value: Partial<TDateRange> | undefined
  onChange: (newValues: Partial<TDateRange>) => void
}

const datePopOverOtherProps: Partial<PopoverProps> = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center'
  }
}

const formatInputDate = (date: Date | undefined) => {
  if (!date) {
    return 'Any Date'
  }

  return format(date, DATE_FORMAT)
}

export const RangeDateSelector = ({ value, onChange }: Props) => {
  const classes = useStyles()

  const [isFromDialogOpen, setIsFromDialogOpen] = useState(false)
  const [isToDialogOpen, setIsToDialogOpen] = useState(false)

  const fromInputRef = useRef<HTMLInputElement>(null)
  const toInputRef = useRef<HTMLInputElement>(null)

  const to = value?.to ? new Date(value.to) : undefined
  const from = value?.from ? new Date(value.from) : undefined

  const modifiers = { start: from, end: to }

  const handleChangeFrom = useCallback(
    (day: Date) => {
      setIsFromDialogOpen(false)
      setIsToDialogOpen(true)

      // Set time of from date to 00:00:00:0000
      const firstMomentOfFromDay = day
        ? new Date(day.setHours(0, 0, 0, 0))
        : undefined

      onChange({
        from: firstMomentOfFromDay
          ? firstMomentOfFromDay.toISOString()
          : undefined,
        to: to ? to.toISOString() : undefined
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [to]
  )

  const handleChangeTo = useCallback(
    (day: Date) => {
      setIsToDialogOpen(false)

      // Set time of to date to 23:59:59:999
      const lastMomentOfToDay = day
        ? new Date(day.setHours(23, 59, 59, 999))
        : undefined

      onChange({
        from: from ? from.toISOString() : undefined,
        to: lastMomentOfToDay ? lastMomentOfToDay.toISOString() : undefined
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [from]
  )

  return (
    <Grid>
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item xs={5}>
          <TextField
            ref={fromInputRef}
            size="small"
            label="From Date"
            variant="outlined"
            inputProps={{
              readOnly: true
            }}
            value={formatInputDate(from)}
            onClick={() => {
              setIsFromDialogOpen(true)
            }}
          />
        </Grid>
        <Grid item container justifyContent="center" xs={2}>
          <Typography className={classes.to} variant="body1">
            To
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <TextField
            ref={toInputRef}
            size="small"
            label="To Date"
            variant="outlined"
            value={formatInputDate(to)}
            onClick={() => {
              setIsToDialogOpen(true)
            }}
          />
        </Grid>
      </Grid>

      <Popover
        open={isFromDialogOpen}
        anchorEl={fromInputRef.current}
        {...datePopOverOtherProps}
        onClose={() => {
          setIsFromDialogOpen(false)
        }}
      >
        <DayPicker
          className={classes.rangeDatePicker}
          selectedDays={[from, { from, to }]}
          disabledDays={to ? { after: to } : undefined}
          modifiers={modifiers}
          onDayClick={handleChangeFrom}
        />
        <Grid item xs={12}>
          <Button
            className={classes.footerResetButton}
            onClick={() => {
              onChange({ from: undefined })
            }}
            variant="text"
            color="secondary"
          >
            Clear
          </Button>
        </Grid>
      </Popover>
      <Popover
        open={isToDialogOpen}
        anchorEl={toInputRef.current}
        {...datePopOverOtherProps}
        onClose={() => {
          setIsToDialogOpen(false)
        }}
      >
        <DayPicker
          className={classes.rangeDatePicker}
          selectedDays={[from, { from, to }]}
          disabledDays={from ? { before: from } : undefined}
          modifiers={modifiers}
          onDayClick={handleChangeTo}
        />
        <Grid item xs={12}>
          <Button
            className={classes.footerResetButton}
            onClick={() => {
              onChange({ to: undefined })
            }}
            variant="text"
            color="secondary"
          >
            Clear
          </Button>
        </Grid>
      </Popover>
    </Grid>
  )
}

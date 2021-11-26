import { useCallback } from 'react'

import { Grid, makeStyles } from '@material-ui/core'
import { DateUtils, RangeModifier } from 'react-day-picker'
import DayPicker from 'react-day-picker/DayPicker'

import { TDateRange } from '../../types'

export const useStyles = makeStyles(
  theme => ({
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

export const RangeDateSelector = ({ value, onChange }: Props) => {
  const classes = useStyles()

  const to = value?.to ? new Date(value.to) : undefined
  const from = value?.from ? new Date(value.from) : undefined

  const modifiers = { start: from, end: to }

  const handleChange = useCallback(
    (day: Date) => {
      const range = DateUtils.addDayToRange(day, { to, from }) as RangeModifier

      // Set time of from date to 00:00:00:0000
      const firstMomentOfFromDay =
        range && range.from
          ? new Date(range.from.setHours(0, 0, 0, 0))
          : undefined

      // Set time of to date to 23:59:59:999
      const lastMomentOfToDay =
        range && range.to
          ? new Date(range.to.setHours(23, 59, 59, 999))
          : undefined

      // Convert date to iso string as it is required by API
      onChange({
        from: firstMomentOfFromDay
          ? firstMomentOfFromDay.toISOString()
          : undefined,
        to: lastMomentOfToDay ? lastMomentOfToDay.toISOString() : undefined
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  )

  return (
    <Grid>
      <DayPicker
        className={classes.rangeDatePicker}
        selectedDays={[from, { from, to }]}
        modifiers={modifiers}
        onDayClick={handleChange}
      />
    </Grid>
  )
}

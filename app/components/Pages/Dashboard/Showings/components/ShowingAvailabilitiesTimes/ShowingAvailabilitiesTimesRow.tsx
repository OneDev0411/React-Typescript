import { memo } from 'react'

import {
  Box,
  FormHelperText,
  Grid,
  IconButton,
  makeStyles
} from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'
import { FormState, FORM_ERROR } from 'final-form'
import { Form, FormSpy } from 'react-final-form'
import { useDebouncedCallback } from 'use-debounce/lib'

import { WeekdaySelect, FormTimePicker } from 'components/final-form-fields'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ShowingAvailabilityItem } from '../../types'

import {
  getSecondsDifference,
  humanTimeToTimestamp,
  timestampToHumanTime
} from './helpers'
import ShowingAvailabilitiesTimesRowInsert from './ShowingAvailabilitiesTimesRowInsert'

const useStyles = makeStyles(
  theme => ({
    root: {
      '&:hover $insert': { opacity: 1 }
    },
    insert: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ShowingAvailabilitiesTimesRow' }
)

interface FormValues {
  start: string
  end: string
  weekday: Weekday
}

export interface ShowingAvailabilitiesTimesRowProps
  extends ShowingAvailabilityItem {
  onDelete: (id: UUID) => void
  onChange: (id: UUID, row: ShowingAvailabilityItem) => void
  onInsert: () => void
  disableDelete?: boolean
  hasError: boolean
  hasInsertButton: boolean
  showingDuration: number
}

function ShowingAvailabilitiesTimesRow({
  id,
  weekday,
  availability,
  onChange,
  onDelete,
  disableDelete = false,
  hasError,
  hasInsertButton,
  onInsert,
  showingDuration
}: ShowingAvailabilitiesTimesRowProps) {
  const classes = useStyles()

  const handleDelete = () => {
    onDelete(id)
  }

  const [debouncedHandleSubmit] = useDebouncedCallback((values: FormValues) => {
    const start = values.start
      ? humanTimeToTimestamp(values.start)
      : availability[0]
    const end = values.end ? humanTimeToTimestamp(values.end) : availability[1]

    if (
      values.weekday === weekday &&
      start === availability[0] &&
      end === availability[1]
    ) {
      return
    }

    onChange(id, {
      id,
      weekday: values.weekday,
      availability: [start, end]
    })
  }, 250)

  const handleChange = ({ values }: FormState<FormValues>) => {
    debouncedHandleSubmit(values)
  }

  const validateForm = (values: FormValues) => {
    const errors: Partial<
      Record<keyof FormValues | typeof FORM_ERROR, string>
    > = {}

    if (values.end <= values.start) {
      errors[FORM_ERROR] =
        'The "From" value must be earlier than the "To" value.'
    } else if (
      values.start &&
      values.end &&
      getSecondsDifference(values.end, values.start) < showingDuration
    ) {
      errors[FORM_ERROR] =
        // eslint-disable-next-line max-len
        'The time difference between "From" and "To" values should exceed the Showing duration.'
    }

    return errors
  }

  return (
    <Form<FormValues>
      onSubmit={debouncedHandleSubmit}
      initialValues={{
        weekday,
        start: timestampToHumanTime(availability[0]),
        end: timestampToHumanTime(availability[1])
      }}
      validate={validateForm}
    >
      {({ handleSubmit, errors }) => {
        const formError: string | undefined = errors
          ? errors[FORM_ERROR]
          : undefined

        return (
          <form onSubmit={handleSubmit} className={classes.root}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12} md={5}>
                <Box mr={2}>
                  <WeekdaySelect name="weekday" margin="none" />
                </Box>
              </Grid>
              <Grid item xs={5} sm={5} md={3}>
                <Box mr={2}>
                  <FormTimePicker
                    label="From"
                    name="start"
                    error={!!formError || hasError}
                    margin="none"
                  />
                </Box>
              </Grid>
              <Grid item xs={5} sm={5} md={3}>
                <Box mr={2}>
                  <FormTimePicker
                    label="To"
                    name="end"
                    error={!!formError || hasError}
                    margin="none"
                  />
                </Box>
              </Grid>
              <Grid item md="auto">
                <Box display="flex" height="100%" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={handleDelete}
                    disabled={disableDelete}
                  >
                    <SvgIcon
                      path={mdiTrashCanOutline}
                      size={muiIconSizes.medium}
                    />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <FormSpy subscription={{ values: true }} onChange={handleChange} />
            {formError && (
              <Box mb={1}>
                <FormHelperText error>{formError}</FormHelperText>
              </Box>
            )}
            {hasInsertButton && (
              <ShowingAvailabilitiesTimesRowInsert
                onClick={onInsert}
                className={classes.insert}
              />
            )}
          </form>
        )
      }}
    </Form>
  )
}

export default memo(ShowingAvailabilitiesTimesRow)

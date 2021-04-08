import React, { memo } from 'react'
import { Box, FormHelperText, Grid, IconButton } from '@material-ui/core'

import { mdiDeleteOutline } from '@mdi/js'

import { Form, FormSpy } from 'react-final-form'

import { FormState, FORM_ERROR } from 'final-form'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import FormDayOfWeekSelect from 'components/final-form-fields/FormDayOfWeekSelect'
import FormTimePicker from 'components/final-form-fields/FormTimePicker'

import { humanTimeToTimestamp, timestampToHumanTime } from './helpers'

interface FormValues {
  start: string
  end: string
  weekday: IDayOfWeek
}

interface ShowingAvailabilitiesTimesRowProps extends IShowingAvailabilitySlot {
  onDelete: (id: UUID) => void
  onChange: (id: UUID, row: IShowingAvailabilitySlot) => void
  disableDelete?: boolean
}

function ShowingAvailabilitiesTimesRow({
  id,
  weekday,
  availability,
  onChange,
  onDelete,
  disableDelete = false
}: ShowingAvailabilitiesTimesRowProps) {
  const handleDelete = () => {
    onDelete(id)
  }

  const handleSubmit = (values: FormValues) => {
    onChange(id, {
      id,
      weekday: values.weekday,
      availability: [
        humanTimeToTimestamp(values.start),
        humanTimeToTimestamp(values.end)
      ]
    })
  }

  const handleChange = ({ values }: FormState<FormValues>) => {
    handleSubmit(values)
  }

  const validateForm = (values: FormValues) => {
    const errors: Partial<
      Record<keyof FormValues | typeof FORM_ERROR, string>
    > = {}

    if (values.end <= values.start) {
      errors[FORM_ERROR] =
        'The "From" value must be earlier than the "To" value'
    }

    return errors
  }

  return (
    <Form<FormValues>
      onSubmit={handleSubmit}
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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={5}>
                <FormDayOfWeekSelect name="weekday" margin="dense" />
              </Grid>
              <Grid item xs={5} lg={3}>
                <FormTimePicker
                  label="From"
                  name="start"
                  error={!!formError}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={5} lg={3}>
                <FormTimePicker
                  label="To"
                  name="end"
                  error={!!formError}
                  margin="dense"
                />
              </Grid>
              <Grid item lg="auto">
                <Box display="flex" height="100%" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={handleDelete}
                    disabled={disableDelete}
                  >
                    <SvgIcon
                      path={mdiDeleteOutline}
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
          </form>
        )
      }}
    </Form>
  )
}

export default memo(ShowingAvailabilitiesTimesRow)

import { Form } from 'react-final-form'

import { Box, Button, Checkbox, FormControlLabel } from '@material-ui/core'

import { ChangeEvent, useState } from 'react'

import {
  FormSelect,
  FormTextField,
  FormSelectProps
} from 'components/final-form-fields'

import { getDefaultShowingEndDate, getDefaultShowingStartDate } from './helpers'

const durationOptions: FormSelectProps<number>['options'] = [
  { label: '15 mins', value: 15 * 60 },
  { label: '30 mins', value: 30 * 60 },
  { label: '1 hour', value: 60 * 60 }
]

const defaultStartDate = getDefaultShowingStartDate()

interface ShowingDateAndDurationFormProps {
  initialValues?: Partial<IShowingDateDurationInput>
  onSubmit: (values: IShowingDateDurationInput) => void
}

function ShowingDateAndDurationForm({
  initialValues,
  onSubmit
}: ShowingDateAndDurationFormProps) {
  const [hasEndTime, setHasEndTime] = useState(false)

  const validate = (values: IShowingDateDurationInput) => {
    const errors: Partial<Record<keyof IShowingDateDurationInput, string>> = {}

    if (hasEndTime && values.end_date && values.start_date > values.end_date) {
      errors.end_date =
        'The "End date" value must be later than the "Start date" value'
    }

    return errors
  }

  const handleSubmit = (values: IShowingDateDurationInput) => {
    const newValues: IShowingDateDurationInput = { ...values }

    if (!hasEndTime) {
      delete newValues.end_date
    }

    onSubmit(newValues)
  }

  return (
    <Form<IShowingDateDurationInput>
      onSubmit={handleSubmit}
      initialValues={{
        start_date: defaultStartDate,
        duration: durationOptions[0] ? durationOptions[0].value : undefined,
        ...initialValues
      }}
      validate={validate}
    >
      {({ handleSubmit, values, form }) => (
        <form onSubmit={handleSubmit}>
          <FormSelect<number>
            name="duration"
            label="Duration"
            options={durationOptions}
          />
          <FormTextField
            type="date"
            name="start_date"
            label="Start date"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputProps: {
                type: 'date',
                min: defaultStartDate,
                max: hasEndTime ? values.end_date : undefined
              }
            }}
          />
          <FormControlLabel
            label="Has end time"
            control={<Checkbox color="primary" />}
            onChange={(event: ChangeEvent, checked: boolean) => {
              setHasEndTime(checked)

              if (checked) {
                if (!values.end_date || values.end_date < values.start_date) {
                  form.change(
                    'end_date',
                    getDefaultShowingEndDate(
                      new Date(values.start_date),
                      values.end_date ? 0 : 14
                    )
                  )
                }
              }
            }}
          />
          {hasEndTime && (
            <FormTextField
              type="date"
              name="end_date"
              label="End date"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: {
                  type: 'date',
                  min: values.start_date
                }
              }}
            />
          )}
          <Box mt={2} textAlign="right">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
            >
              Next
            </Button>
          </Box>
        </form>
      )}
    </Form>
  )
}

export default ShowingDateAndDurationForm

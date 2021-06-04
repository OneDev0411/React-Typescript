import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
  FormHelperText
} from '@material-ui/core'
import { ChangeEvent } from 'react'
import { Field } from 'react-final-form'

interface ShowingRoleFormDialogCheckboxGroupFieldProps {
  label: string
  name: string
}

function ShowingRoleFormDialogCheckboxGroupField({
  label,
  name
}: ShowingRoleFormDialogCheckboxGroupFieldProps) {
  return (
    <Field<INotificationDeliveryType[]>
      name={name}
      render={({ input, meta }) => {
        const handleChange = (
          event: ChangeEvent<HTMLInputElement>,
          checked: boolean
        ) => {
          const newValue = [...input.value]

          if (checked) {
            newValue.push(event.target.name as INotificationDeliveryType)
          } else {
            const index = newValue.findIndex(v => v === event.target.name)

            if (index === -1) {
              return
            }

            newValue.splice(index, 1)
          }

          input.onChange({
            ...event,
            target: {
              ...event.target,
              type: 'checkbox-group',
              value: [...new Set(newValue)]
            }
          })
        }

        return (
          <FormControl margin="normal">
            <Typography variant="subtitle2">{label}</Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChange}
                    checked={input.value.includes('email')}
                    name="email"
                    color="primary"
                  />
                }
                label="Email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChange}
                    checked={input.value.includes('sms')}
                    name="sms"
                    color="primary"
                  />
                }
                label="Text"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChange}
                    checked={input.value.includes('push')}
                    name="push"
                    color="primary"
                  />
                }
                label="Mobile App"
              />
            </FormGroup>
            {meta.touched && meta.error && (
              <FormHelperText error>{meta.error}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}

export default ShowingRoleFormDialogCheckboxGroupField

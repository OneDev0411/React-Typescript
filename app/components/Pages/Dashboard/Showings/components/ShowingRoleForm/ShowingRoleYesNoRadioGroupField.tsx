import { ReactNode, ChangeEvent } from 'react'

import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Typography
} from '@material-ui/core'
import { Field, FieldProps } from 'react-final-form'

interface ShowingRoleYesNoRadioGroupFieldProps
  extends Pick<FieldProps<boolean, any>, 'validate'> {
  name: string
  label: string
  required?: boolean
  helperText?: ReactNode
}

function ShowingRoleYesNoRadioGroupField({
  label,
  required = false,
  helperText,
  ...otherProps
}: ShowingRoleYesNoRadioGroupFieldProps) {
  return (
    <Field
      {...otherProps}
      required={required}
      render={({ input: { value, onChange }, meta }) => {
        const hasError: boolean =
          ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
          meta.touched

        const errorOrHelperText = hasError
          ? meta.error || meta.submitError
          : helperText

        const handleChange = (
          event: ChangeEvent<HTMLInputElement>,
          value: string
        ) => {
          onChange({
            ...event,
            target: {
              ...event.target,
              value: value === 'Yes'
            }
          })
        }

        return (
          <FormControl margin="normal" fullWidth>
            <Typography variant="subtitle2">{label}</Typography>
            <RadioGroup
              row
              name="showing-role"
              value={value ? 'Yes' : 'No'}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Yes"
                control={<Radio color="primary" />}
                label="Yes"
              />
              <FormControlLabel
                value="No"
                control={<Radio color="primary" />}
                label="No"
              />
            </RadioGroup>
            {errorOrHelperText && (
              <FormHelperText error={hasError}>
                {errorOrHelperText}
              </FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}

export default ShowingRoleYesNoRadioGroupField

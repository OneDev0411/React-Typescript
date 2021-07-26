import { ReactNode } from 'react'

import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControl,
  FormHelperText,
  FormControlProps
} from '@material-ui/core'
import { Field } from 'react-final-form'

import { FinalFieldProps } from '../types'

interface BaseFormCheckboxProps
  extends Omit<CheckboxProps, 'inputProps'>,
    Pick<FormControlProps, 'margin' | 'fullWidth'> {
  label: ReactNode
  helperText?: ReactNode
}

export type FormCheckboxProps = FinalFieldProps<BaseFormCheckboxProps>

function FormCheckbox({
  name,
  label,
  helperText,
  margin = 'normal',
  validate,
  format,
  fullWidth = true,
  color = 'primary',
  ...otherProps
}: FormCheckboxProps) {
  return (
    <Field
      type="checkbox"
      name={name}
      validate={validate}
      format={format}
      render={({ input: { name, checked, onChange, ...restInput }, meta }) => {
        const hasError: boolean =
          ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
          meta.touched

        const errorText = hasError ? meta.error || meta.submitError : helperText

        return (
          <FormControl margin={margin} fullWidth={fullWidth}>
            <FormControlLabel
              control={
                <Checkbox
                  {...otherProps}
                  inputProps={restInput}
                  color={color}
                />
              }
              label={label}
              checked={checked}
              onChange={onChange}
            />
            {errorText && (
              <FormHelperText error={hasError}>{errorText}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}

export default FormCheckbox

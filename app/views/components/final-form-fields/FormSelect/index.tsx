import { Field } from 'react-final-form'

import Select, { SelectProps, SelectValue } from 'components/Select'

import { FinalFieldProps } from '../types'

export type FormSelectProps<T extends SelectValue = string> = FinalFieldProps<
  SelectProps<T>
>

function FormSelect<T extends SelectValue = string>({
  name,
  helperText,
  margin = 'normal',
  validate,
  format,
  options,
  ...otherProps
}: FormSelectProps<T>) {
  return (
    <Field
      name={name}
      validate={validate}
      format={format}
      render={({ input: { name, value, onChange, ...restInput }, meta }) => {
        const hasError: boolean =
          ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
          meta.touched

        return (
          <Select
            {...otherProps}
            value={value}
            onChange={onChange}
            options={options}
            inputProps={restInput}
            margin={margin}
            error={hasError}
            helperText={hasError ? meta.error || meta.submitError : helperText}
          />
        )
      }}
    />
  )
}

export default FormSelect

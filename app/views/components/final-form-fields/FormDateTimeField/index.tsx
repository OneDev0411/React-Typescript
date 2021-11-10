import FormTextField, { FormTextFieldProps } from '../FormTextField'

export interface FormDateTimeFieldProps
  extends Omit<FormTextFieldProps, 'format' | 'parse' | 'type'> {
  mode?: 'standard' | 'timestamp'
}

function FormDateTimeField({
  mode = 'standard',
  InputLabelProps,
  ...otherProps
}: FormDateTimeFieldProps) {
  const format = (value: string | number) => {
    if (!value || Number.isNaN(value)) {
      return ''
    }

    if (typeof value === 'string') {
      return value
    }

    return new Date(value * 1000).toISOString().slice(0, 16)
  }

  const parse = (value: string | number) => {
    if (mode === 'timestamp') {
      return value ? new Date(value).getTime() / 1000 : Number.NaN
    }

    return value
  }

  return (
    <FormTextField<string | number>
      {...otherProps}
      format={format}
      parse={parse}
      type="datetime-local"
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true
      }}
    />
  )
}

export default FormDateTimeField

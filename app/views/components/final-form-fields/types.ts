import type { FieldProps } from 'react-final-form'

export type FinalFieldProps<T, FieldValue = string> = Omit<
  T,
  'name' | 'defaultValue' | 'defaultChecked' | 'value'
> &
  Pick<FieldProps<FieldValue, any>, 'name' | 'format' | 'validate' | 'parse'>

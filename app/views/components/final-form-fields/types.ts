import type { FieldProps } from 'react-final-form'

export type FinalFieldProps<T> = Omit<T, 'name' | 'defaultValue'> &
  Pick<FieldProps<string, any>, 'name' | 'format' | 'validate'>

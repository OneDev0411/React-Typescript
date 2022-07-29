import { FilledTextFieldProps } from '@material-ui/core'
import { Field } from 'react-final-form'

import { MUITextInput } from '@app/views/components/Forms/MUITextInput'

interface Props extends Omit<FilledTextFieldProps, 'variant'> {
  name: string
}

export function TextField(props: Props) {
  return (
    <Field
      name={props.name}
      render={fieldProps => {
        return <MUITextInput variant="filled" {...fieldProps} {...props} />
      }}
    />
  )
}

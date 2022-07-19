import {
  createStyles,
  FilledTextFieldProps,
  makeStyles,
  Theme
} from '@material-ui/core'
import { Field } from 'react-final-form'

import { MUITextInput } from '@app/views/components/Forms/MUITextInput'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(3),

      [theme.breakpoints.up(300)]: {
        width: 280
      },
      [theme.breakpoints.up('sm')]: {
        width: 400
      }
    }
  })
)

interface Props extends Omit<FilledTextFieldProps, 'variant'> {
  name: string
}

export function TextField(props: Props) {
  const classes = useStyles(props)

  return (
    <Field
      name={props.name}
      render={fieldProps => {
        return (
          <MUITextInput
            variant="filled"
            classes={classes}
            {...fieldProps}
            {...props}
          />
        )
      }}
    />
  )
}

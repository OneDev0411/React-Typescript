import React from 'react'
import { Field } from 'react-final-form'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { MUITextInput } from '../../../../views/components/Forms/MUITextInput'

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

export function TextField(props) {
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

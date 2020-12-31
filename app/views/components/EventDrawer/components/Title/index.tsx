import React, { CSSProperties } from 'react'
import { Field } from 'react-final-form'
import { InputBase, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    input: {
      padding: theme.spacing(0.5, 1),
      width: '100%',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      ...theme.typography.body1,
      '&:focus': {
        outline: 'none'
      },
      '&::placeholder': {
        color: theme.palette.grey[500]
      }
    }
  }),
  { name: 'EventTitle' }
)

interface Props {
  fullWidth: boolean
  placeholder: string
  style: CSSProperties
}

export function Title({
  fullWidth = true,
  placeholder = 'Add a descriptive title…',
  style = {}
}: Props) {
  const classes = useStyles()

  return (
    <Field
      name="title"
      render={({ input, meta }) => (
        <div
          style={{
            width: fullWidth ? '100%' : 'calc(100% - 20px)',
            ...style
          }}
        >
          <InputBase
            {...input}
            type="text"
            autoComplete="off"
            placeholder={placeholder}
            className={classes.input}
          />
          {meta.error && meta.touched && (
            <div style={{ color: '#F43B38' }}>{meta.error}</div>
          )}
        </div>
      )}
    />
  )
}

import * as React from 'react'
import { createStyles, FormLabel, makeStyles, Theme } from '@material-ui/core'
import { FormLabelProps } from '@material-ui/core/FormLabel'
import classNames from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        marginRight: `${theme.spacing(2)}px`
      }
    }),
  { name: 'InlineInputLabel' }
)
/**
 * Form label to be used beside MUI inputs (normally as startAdornment)
 *
 * Possible improvement: we can add a margin prop similar to what TextField
 * accepts to adjust spacing based on that
 */
export function InlineInputLabel({ className, ...props }: FormLabelProps) {
  const classes = useStyles()

  return (
    <FormLabel {...props} className={classNames(className, classes.root)} />
  )
}

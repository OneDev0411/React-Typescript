import * as React from 'react'
import { createStyles, FormLabel, makeStyles, Theme } from '@material-ui/core'
import { FormLabelProps } from '@material-ui/core/FormLabel'
import classNames from 'classnames'
import { forwardRef } from 'react'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        marginRight: `${theme.spacing(2)}px`,
        // without this, required asterisk falls down in Chrome on windows :|
        minWidth: 'fit-content'
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
export const InlineInputLabel = forwardRef(function InlineInputLabel(
  { className, ...props }: FormLabelProps,
  ref
) {
  const classes = useStyles()

  return (
    <FormLabel
      innerRef={ref}
      {...props}
      className={classNames(className, classes.root)}
    />
  )
})

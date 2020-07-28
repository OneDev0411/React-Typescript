import React, { DetailedHTMLProps, HTMLAttributes } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  () => ({
    spacer: {
      display: 'flex',
      flexGrow: 1
    }
  }),
  { name: 'TabSpacer' }
)

export function TabSpacer({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const classes = useStyles()

  return <div {...props} className={classNames(classes.spacer, className)} />
}

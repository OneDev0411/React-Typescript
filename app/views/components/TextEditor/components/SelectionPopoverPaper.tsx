import React from 'react'
import { createStyles, makeStyles, Paper, Theme } from '@material-ui/core'

import { PaperProps } from '@material-ui/core/Paper'
import classNames from 'classnames'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0.5)
    }
  })
const useStyles = makeStyles(styles, { name: 'SelectionPopoverPaper' })

export function SelectionPopoverPaper(props: PaperProps) {
  const classes = useStyles(props)

  return (
    <Paper
      elevation={10}
      {...props}
      className={classNames(classes.root, props.className)}
      onMouseDown={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
    />
  )
}

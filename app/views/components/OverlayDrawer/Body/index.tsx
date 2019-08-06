import React, { HTMLProps } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'hidden',
      padding: theme.spacing(0, 3, 0),
      flex: '1'
    }
  })
)

const Body = ({ children, className, ...rest }: HTMLProps<HTMLDivElement>) => {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, className)} {...rest}>
      {children}
    </div>
  )
}
export default Body

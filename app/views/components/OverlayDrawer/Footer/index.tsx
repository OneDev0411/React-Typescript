import React, { ComponentPropsWithoutRef } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Flex from 'styled-flex-component'
import classNames from 'classnames'

type Props = ComponentPropsWithoutRef<typeof Flex>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '4.5rem',
      borderTop: `1px solid ${theme.palette.divider}`,
      margin: theme.spacing(0, 3)
    }
  })
)

const Footer = ({ children, className, ...props }: Props) => {
  const classes = useStyles()

  return (
    <Flex
      alignCenter
      justifyBetween
      className={classNames(className, classes.root)}
      {...props}
    >
      {children}
    </Flex>
  )
}
export default Footer

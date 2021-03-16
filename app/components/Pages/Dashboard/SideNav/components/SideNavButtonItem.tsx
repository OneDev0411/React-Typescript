import React, { RefObject } from 'react'
import { ButtonBase, makeStyles, Theme } from '@material-ui/core'
import { ButtonBaseProps } from '@material-ui/core/ButtonBase'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    paddingLeft: theme.spacing(3),
    color: theme.palette.navbar.contrastText,
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    opacity: 0.7,

    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

export const SideNavButtonItem = React.forwardRef(
  (props: ButtonBaseProps, ref: RefObject<HTMLButtonElement>) => {
    const classes = useStyles()

    return (
      <ButtonBase ref={ref} className={classes.button} onClick={props.onClick}>
        {props.children}
      </ButtonBase>
    )
  }
)

export default SideNavButtonItem

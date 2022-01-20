import React, { RefObject } from 'react'

import { ButtonBase, makeStyles, Theme } from '@material-ui/core'
import { ButtonBaseProps } from '@material-ui/core/ButtonBase'

const useStyles = makeStyles(
  (theme: Theme) => ({
    button: {
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
      borderLeft: `${theme.spacing(0.25)}px solid transparent`,
      padding: theme.spacing(0.5, 1),
      color: theme.palette.common.white,
      fontSize: theme.typography.body1.fontSize,
      opacity: 1,
      width: '100%',

      '&:hover': {
        color: theme.palette.primary.main
      }
    }
  }),
  { name: 'sideNavButton' }
)

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

import React, { RefObject } from 'react'

import { ButtonBase, makeStyles, Theme } from '@material-ui/core'
import { ButtonBaseProps } from '@material-ui/core/ButtonBase'

const useStyles = makeStyles(
  (theme: Theme) => ({
    button: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.5, 1, 0.5, 4.25),
      color: theme.palette.common.white,
      fontSize: theme.typography.body1.fontSize,
      opacity: 1,
      width: '100%',

      '& svg': {
        position: 'absolute',
        left: '-26px'
      },

      '&:hover': {
        textDecoration: 'none',
        color: theme.palette.common.black,
        backgroundColor: theme.palette.common.white,

        '& svg': {
          color: theme.palette.primary.main
        }
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

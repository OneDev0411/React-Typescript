import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'

import * as React from 'react'
import { forwardRef, Ref } from 'react'

import classNames from 'classnames'

import { fade } from '@material-ui/core/styles'

import IconArrowDropDown from '../SvgIcons/ArrowDropDown/IconArrowDropDown'

interface Props extends ButtonProps {
  isActive?: boolean
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    button: {
      whiteSpace: 'nowrap'
    },
    buttonActive: {
      '&, &:hover': {
        background: fade(
          theme.palette.primary.main,
          theme.palette.action.hoverOpacity
        )
      }
    },
    rotated: {
      transform: 'rotateX(180deg)'
    }
  })
})

/**
 * A button to be used as trigger for dropdown or any toggleable UI.
 * It Wraps {@link Button Material UI Button} and adds an arrow on it's right
 * side and some background style for active style.
 * @param active
 * @param children
 * @param buttonProps
 * @constructor
 */
export const DropdownToggleButton = forwardRef(
  (
    { isActive, children, ...buttonProps }: Props,
    ref: Ref<HTMLButtonElement>
  ) => {
    const classes = useStyles()

    return (
      <Button
        {...buttonProps}
        classes={{
          root: classNames(classes.button, { [classes.buttonActive]: isActive })
        }}
        ref={ref}
      >
        {children}
        <IconArrowDropDown
          className={classNames({ [classes.rotated]: isActive })}
        />
      </Button>
    )
  }
)

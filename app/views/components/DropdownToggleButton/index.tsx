import React, { forwardRef, Ref, ReactNode } from 'react'
import classNames from 'classnames'
import {
  Button,
  ButtonProps,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

import { mdiChevronDown } from '@mdi/js'

import { SvgIcon } from '../SvgIcons/SvgIcon'

import { ClassesProps } from '../../../utils/ts-utils'

interface Props extends ButtonProps {
  isActive?: boolean
  children?: ReactNode
}

const styles = (theme: Theme) => {
  return createStyles({
    root: {
      whiteSpace: 'nowrap'
    },
    buttonActive: {
      '&, &:hover': {
        background: fade(
          theme.palette.secondary.main,
          theme.palette.action.hoverOpacity
        )
      }
    },
    rotated: {
      transform: 'rotateX(180deg)'
    },
    arrowIcon: {}
  })
}
const useStyles = makeStyles(styles)

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
    {
      isActive,
      children,
      classes,
      ...buttonProps
    }: Props & ClassesProps<typeof styles>,
    ref: Ref<HTMLButtonElement>
  ) => {
    const styleClasses = useStyles({ classes })

    return (
      <Button
        {...buttonProps}
        classes={{
          root: classNames(styleClasses.root, {
            [styleClasses.buttonActive]: isActive
          })
        }}
        ref={ref}
      >
        {children}
        <SvgIcon
          path={mdiChevronDown}
          className={classNames(styleClasses.arrowIcon, {
            [styleClasses.rotated]: isActive
          })}
        />
      </Button>
    )
  }
)

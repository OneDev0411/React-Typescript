import React, { forwardRef, Ref, ReactNode } from 'react'

import {
  Button,
  ButtonProps,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import { alpha } from '@material-ui/core/styles'
import { mdiChevronDown } from '@mdi/js'
import classNames from 'classnames'

import { ClassesProps } from '../../../utils/ts-utils'
import { muiIconSizes } from '../SvgIcons/icon-sizes'
import { SvgIcon } from '../SvgIcons/SvgIcon'

interface Props extends ButtonProps {
  component?: string
  isActive?: boolean
  children?: ReactNode
  iconPath?: string
}

const styles = (theme: Theme) => {
  return createStyles({
    root: {
      whiteSpace: 'nowrap'
    },
    buttonActive: {
      '&, &:hover': {
        background: alpha(
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
      iconPath = mdiChevronDown,
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
          path={iconPath}
          size={muiIconSizes.small}
          className={classNames(styleClasses.arrowIcon, {
            [styleClasses.rotated]: isActive
          })}
        />
      </Button>
    )
  }
)

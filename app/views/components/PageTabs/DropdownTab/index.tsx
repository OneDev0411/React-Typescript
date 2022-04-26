import React, { useState } from 'react'

import {
  Popover,
  makeStyles,
  createStyles,
  Theme,
  Tooltip,
  TooltipProps
} from '@material-ui/core'
import { PopoverProps } from '@material-ui/core/Popover'
import classnames from 'classnames'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

interface ThemeProps {
  isOpen: boolean
}

interface RenderProps {
  toggleMenu: () => void
}

interface Props {
  title: React.ReactNode
  buttonClassName?: string
  buttonVariant?: 'text' | 'outlined' | 'contained' | undefined
  popoverOptions?: Omit<PopoverProps, 'open' | 'anchorEl' | 'onClose'>
  tooltipOptions?: Omit<TooltipProps, 'children'>
  children: (renderProps: RenderProps) => React.ReactNode
  component?: string
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      button: (props: ThemeProps) => {
        const styles = {
          ...theme.typography.body1,
          color: theme.palette.common.black
        }

        return {
          ...styles,
          '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: 'transparent'
          }
        }
      }
    }),
  { name: 'DropdownTab' }
)

export function DropdownTab({
  title,
  children,
  buttonClassName = '',
  buttonVariant,
  tooltipOptions,
  popoverOptions,
  component
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const classes = useStyles({
    isOpen: Boolean(anchorEl)
  })

  const toggleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (anchorEl) {
      setAnchorEl(null)

      return
    }

    if (event) {
      setAnchorEl(event.currentTarget)
    }
  }
  const baseButton = (
    <DropdownToggleButton
      isActive={Boolean(anchorEl)}
      size="small"
      onClick={toggleMenu}
      component={component}
      variant={buttonVariant}
      className={classnames(classes.button, buttonClassName)}
    >
      {title}
    </DropdownToggleButton>
  )

  return (
    <>
      {tooltipOptions ? (
        <Tooltip {...tooltipOptions}>{baseButton}</Tooltip>
      ) : (
        baseButton
      )}

      <Popover
        id={anchorEl ? 'tabs-dropdown-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => toggleMenu()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        {...popoverOptions}
      >
        {children({
          toggleMenu
        })}
      </Popover>
    </>
  )
}

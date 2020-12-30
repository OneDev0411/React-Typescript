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

import { DropdownToggleButton } from 'components/DropdownToggleButton'

interface ThemeProps {
  isOpen: boolean
}

interface RenderProps {
  toggleMenu: () => void
}

interface Props {
  title: string
  popoverOptions?: PopoverProps
  tooltipOptions?: Omit<TooltipProps, 'children'>
  children: (renderProps: RenderProps) => React.ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: (props: ThemeProps) => {
      const styles = props.isOpen
        ? {
            color: theme.palette.primary.main,
            ...theme.typography.body1,
            fontWeight: 'normal' as React.CSSProperties['fontWeight']
          }
        : {
            color: theme.palette.text.secondary,
            ...theme.typography.subtitle1,
            fontWeight: 'bold' as React.CSSProperties['fontWeight']
          }

      return {
        ...styles,
        '&:hover': {
          backgroundColor: 'transparent'
        }
      }
    }
  })
)

export function DropdownTab({
  title,
  children,
  tooltipOptions,
  popoverOptions
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
      className={classes.button}
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
        style={{ zIndex: 10 }}
        {...popoverOptions}
      >
        {children({
          toggleMenu
        })}
      </Popover>
    </>
  )
}

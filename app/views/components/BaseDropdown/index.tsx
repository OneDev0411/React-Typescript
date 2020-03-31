import React, { useState } from 'react'
import { ReactNode, RefObject, useRef } from 'react'
import {
  ButtonProps,
  PopperProps,
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
  useTheme
} from '@material-ui/core'

import { useControllableState } from 'react-use-controllable-state/dist'

import { DropdownToggleButton } from '../DropdownToggleButton'

export interface RenderToggleButtonProps {
  isActive: boolean
  ref: RefObject<any>
  onClick: () => void
  'aria-controls': 'menu-list-grow'
  'aria-haspopup': 'true'
}

export interface Props {
  /**
   * for optional control over isOpen state. If passed, you need to pass
   * onIsOpenChange too.
   */
  isOpen?: boolean
  onIsOpenChange?: (open: boolean) => void
  /**
   * menu content.
   */
  renderMenu: (renderProps: { close: () => void }) => ReactNode
  buttonLabel?: ReactNode
  /**
   * props to be passed to DropdownToggleButton if no renderDropdownButton
   * is provided.
   */
  DropdownToggleButtonProps?: Partial<ButtonProps>
  /**
   * customizes the dropdown button rendering
   */
  renderDropdownButton?: (props: RenderToggleButtonProps) => ReactNode
  /**
   * Props to pass to the underlaying {@link Popper} component
   */
  PopperProps?: Partial<Omit<PopperProps, 'open' | 'anchorEl'>>
}

/**
 * A button with an arbitrary menu which is toggled with  the button and
 * is positioned relative to button.
 */
export function BaseDropdown({
  isOpen,
  onIsOpenChange,
  renderMenu,
  buttonLabel,
  DropdownToggleButtonProps = {},
  renderDropdownButton,
  PopperProps = {}
}: Props) {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useControllableState(isOpen, onIsOpenChange, false)
  const [show, setShow] = useState<boolean>(false)
  const theme = useTheme()

  const toggle = (value?: boolean) =>
    setOpen(open => {
      const nextOpen = value !== undefined ? value : !open

      setShow(nextOpen)

      return nextOpen
    })

  const buttonProps: RenderToggleButtonProps = {
    isActive: open,
    ref: anchorRef,
    onClick: () => toggle(),
    'aria-controls': 'menu-list-grow',
    'aria-haspopup': 'true'
  }

  const menu = renderMenu({ close: () => setOpen(false) })

  return (
    // we use ClickAwayListener on the whole stuff to prevent issues
    // when keepMounted is true on the popper
    <>
      {renderDropdownButton ? (
        renderDropdownButton(buttonProps)
      ) : (
        <DropdownToggleButton {...DropdownToggleButtonProps} {...buttonProps}>
          {buttonLabel}
        </DropdownToggleButton>
      )}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        style={{ zIndex: theme.zIndex.modal }}
        transition
        placement="bottom-start"
        {...PopperProps}
      >
        {({ TransitionProps, placement }) =>
          show && (
            <Fade
              {...TransitionProps}
              onExited={() => {
                TransitionProps &&
                  TransitionProps.onExited &&
                  TransitionProps.onExited()
                setShow(false)
              }}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener
                  onClickAway={event => {
                    if (
                      anchorRef.current &&
                      anchorRef.current.contains(event.target as HTMLElement)
                    ) {
                      return
                    }

                    return setOpen(false)
                  }}
                >
                  {menu}
                </ClickAwayListener>
              </Paper>
            </Fade>
          )
        }
      </Popper>
    </>
  )
}

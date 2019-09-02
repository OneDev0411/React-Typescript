import React, { ReactNode } from 'react'
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper
} from '@material-ui/core'
import { PopperPlacementType } from '@material-ui/core/Popper'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

interface RenderMenuProps {
  closeMenu: (event: React.MouseEvent<HTMLButtonElement>) => void
}

interface Props {
  color?: 'inherit' | 'primary' | 'secondary' | 'default'
  children: ReactNode
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  renderMenu: (props: RenderMenuProps) => ReactNode
  popperPlacement?: PopperPlacementType
  size?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
  variant?: 'contained' | 'outlined' | undefined
}

export default function SplitButton(props: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)

  function handleToggle() {
    setIsOpen(prevOpen => !prevOpen)
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setIsOpen(false)
  }

  return (
    <div style={props.style}>
      <ButtonGroup
        aria-label="split button"
        color={props.color}
        disabled={props.disabled}
        size={props.size}
        ref={anchorRef}
        variant={props.variant}
      >
        <Button onClick={props.onClick}>{props.children}</Button>
        <Button
          aria-owns={isOpen ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          size="small"
        >
          <IconKeyboardArrowDown
            style={{
              fill: props.variant === 'contained' ? '#fff' : '#000'
            }}
          />
        </Button>
      </ButtonGroup>
      <Popper
        anchorEl={anchorRef.current}
        open={isOpen}
        placement={props.popperPlacement}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Paper id="menu-list-grow">
                {props.renderMenu({ closeMenu: handleClose })}
              </Paper>
            </ClickAwayListener>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

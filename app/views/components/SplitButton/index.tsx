import React, { ReactNode, ComponentType } from 'react'
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  useTheme
} from '@material-ui/core'
import { PopperPlacementType } from '@material-ui/core/Popper'

import { mdiChevronDown } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ClassesProps } from 'utils/ts-utils'

import useStyles from './styles'

export interface RenderMenuProps {
  closeMenu: (event?: React.MouseEvent<any>) => void
}

interface Props extends ClassesProps<typeof useStyles> {
  color?: 'inherit' | 'primary' | 'secondary' | 'default'
  children: ReactNode
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  RenderMenu: ComponentType<RenderMenuProps>
  popperPlacement?: PopperPlacementType
  className?: string
  size?: 'small' | 'medium' | 'large'
  style?: React.CSSProperties
  variant?: 'contained' | 'outlined' | undefined
}

export default function SplitButton(props: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const classes = useStyles(props)

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
    <>
      <ButtonGroup
        aria-label="split button"
        color={props.color}
        disabled={props.disabled}
        size={props.size}
        ref={anchorRef}
        style={props.style}
        className={props.className}
        variant={props.variant}
      >
        <Button onClick={props.onClick} className={classes.mainButton}>
          {props.children}
        </Button>
        <Button
          aria-owns={isOpen ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          size="small"
          className={props.size === 'small' ? classes.smallArrow : undefined}
        >
          <SvgIcon path={mdiChevronDown} />
        </Button>
      </ButtonGroup>
      <Popper
        anchorEl={anchorRef.current}
        open={isOpen}
        style={{ zIndex: theme.zIndex.modal }}
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
            <div>
              <ClickAwayListener onClickAway={handleClose}>
                <Paper id="menu-list-grow">
                  <props.RenderMenu closeMenu={handleClose} />
                </Paper>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
    </>
  )
}

import React, { ComponentType } from 'react'

import {
  Button,
  ButtonProps,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  useTheme
} from '@material-ui/core'
import { PopperPlacementType } from '@material-ui/core/Popper'
import { mdiChevronDown } from '@mdi/js'
import classNames from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { ClassesProps } from 'utils/ts-utils'

import useStyles from './styles'

export interface RenderMenuProps {
  closeMenu: (event?: React.MouseEvent<any>) => void
}

interface Props
  extends ClassesProps<typeof useStyles>,
    Omit<ButtonProps, 'endIcon' | 'onClick'> {
  RenderMenu: ComponentType<RenderMenuProps>
  popperPlacement?: PopperPlacementType
}

function ButtonMenu({
  className,
  RenderMenu,
  popperPlacement,
  classes: classesProp,
  ...otherProps
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const theme = useTheme()
  const classes = useStyles({ classes: classesProp })

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
      <Button
        {...otherProps}
        className={classNames(classes.root, className)}
        onClick={handleToggle}
        endIcon={<SvgIcon path={mdiChevronDown} />}
        ref={anchorRef}
      />
      <Popper
        anchorEl={anchorRef.current}
        open={isOpen}
        style={{ zIndex: theme.zIndex.modal }}
        placement={popperPlacement}
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
                <Paper id="menu-list-grow" className={classes.paper}>
                  <RenderMenu closeMenu={handleClose} />
                </Paper>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default ButtonMenu

import React, { ReactNode, MouseEvent, useState } from 'react'
import {
  Box,
  Popover,
  PopoverProps,
  makeStyles,
  Theme
} from '@material-ui/core'

import {
  BaseTagSelector,
  Props as BaseTagSelectorProps
} from './BaseTagSelector'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1),
      width: '320px'
    }
  }),
  { name: 'PopoverTagSelector' }
)

interface Props extends BaseTagSelectorProps {
  anchorRenderer: (onClick: (e: MouseEvent<HTMLElement>) => void) => ReactNode
  onSave: (tags: Pick<BaseTagSelectorProps, 'value'>) => void
  popoverProps?: Omit<PopoverProps, 'open' | 'anchorEl' | 'onClose'>
}

export const PopoverTagSelector = ({
  anchorRenderer,
  popoverProps = {},
  ...props
}: Props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'popover-tag-selector' : undefined

  return (
    <>
      {anchorRenderer(handleClick)}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        {...popoverProps}
      >
        <Box className={classes.container}>
          <BaseTagSelector {...props} />
        </Box>
      </Popover>
    </>
  )
}

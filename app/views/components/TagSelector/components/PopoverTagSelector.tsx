import React, { ReactNode, MouseEvent, useState } from 'react'
import {
  Box,
  Button,
  Popover,
  PopoverProps,
  makeStyles,
  fade,
  Theme
} from '@material-ui/core'

import {
  BaseTagSelector,
  Props as BaseTagSelectorProps
} from './BaseTagSelector'
import { SelectorOption } from '../type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1),
      width: '320px'
    },
    actions: {
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      borderTop: `1px solid ${fade(theme.palette.tertiary.dark, 0.12)}`,
      direction: 'rtl'
    }
  }),
  { name: 'PopoverTagSelector' }
)

interface Props extends Omit<BaseTagSelectorProps, 'onChange'> {
  anchorRenderer: (onClick: (e: MouseEvent<HTMLElement>) => void) => ReactNode
  onSave: (tags: SelectorOption[]) => void
  popoverProps?: Omit<PopoverProps, 'open' | 'anchorEl' | 'onClose'>
}

export const PopoverTagSelector = ({
  anchorRenderer,
  popoverProps = {},
  value = [],
  onSave,
  ...props
}: Props) => {
  const classes = useStyles()
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)
  const [selectedTags, setSelectedTags] = useState<SelectorOption[]>(value)

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleChange = (tags: SelectorOption[]) => {
    if (!isDirty) {
      setIsDirty(true)
    }

    setSelectedTags(tags)
  }
  const handleSave = () => {
    if (isDirty) {
      setIsDirty(false)
    }

    onSave(selectedTags)
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
          <BaseTagSelector {...props} value={value} onChange={handleChange} />
          <Box className={classes.actions}>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                disabled={!isDirty}
                onClick={handleSave}
              >
                Done
              </Button>
            </Box>
            <Box mr={0.5}>
              <Button variant="outlined" size="small" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

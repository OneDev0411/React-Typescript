import { ReactNode, MouseEvent } from 'react'

import { Popover, PopoverProps } from '@material-ui/core'

import useStateSafe from '@app/hooks/use-safe-state'

import { TagSelectorForm, TagSelectorFormProps } from './TagSelectorForm'

export interface PopoverTagSelectorProps
  extends Omit<TagSelectorFormProps, 'onCancel'> {
  popoverProps?: Omit<PopoverProps, 'open' | 'anchorEl' | 'onClose'>
  anchorRenderer: (onClick: (e: MouseEvent<HTMLElement>) => void) => ReactNode
}

export const PopoverTagSelector = ({
  popoverProps = {},
  anchorRenderer,
  ...props
}: PopoverTagSelectorProps) => {
  const [anchorEl, setAnchorEl] = useStateSafe<Nullable<HTMLElement>>(null)

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
        <TagSelectorForm {...props} onCancel={handleClose} />
      </Popover>
    </>
  )
}

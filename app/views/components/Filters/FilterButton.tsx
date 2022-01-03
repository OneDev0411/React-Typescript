import React from 'react'

import { Popover, PopoverProps } from '@material-ui/core'

interface RenderButton {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

interface Props {
  renderButton: ({ onClick }: RenderButton) => React.ReactNode
  renderDropdown: () => React.ReactNode
  popoverProps?: Omit<PopoverProps, 'open' | 'id' | 'anchorEl' | 'onClose'>
  className?: string
}

export type FilterButtonDropDownProp<T> = {
  filters: T
  updateFilters: (newFilters: Partial<T>) => void
  defaultFilters: T
  resultsCount?: number
}

export type FilterButtonToggler<T> = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  filters: T
  defaultFilters: T
}

function FilterButton({
  renderButton,
  renderDropdown,
  popoverProps,
  className
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      {renderButton({ onClick: handleOpen })}
      <Popover
        id={id}
        open={open}
        className={className}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        elevation={10}
        {...popoverProps}
      >
        {renderDropdown()}
      </Popover>
    </>
  )
}

export default FilterButton

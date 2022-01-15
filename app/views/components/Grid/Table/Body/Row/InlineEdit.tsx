import { useState, MouseEvent } from 'react'

import { IconButton } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'
import cn from 'classnames'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import type { TableColumn } from '../../types'

interface Props<Row> {
  column: TableColumn<Row>
  rowIndex: number
  columnIndex: number
  totalRows: number
  row: Row
}

export function InlineEdit<Row>({
  column,
  row,
  rowIndex,
  columnIndex,
  totalRows
}: Props<Row>) {
  const [isOpen, setIsOpen] = useState(false)

  if (typeof column.renderInlineEdit !== 'function') {
    return null
  }

  return (
    <BaseDropdown
      placement="bottom-end"
      onIsOpenChange={isOpen => setIsOpen(isOpen)} // don't change it
      renderDropdownButton={({ isActive, onClick, ...buttonProps }) => (
        <IconButton
          size="small"
          className={cn('inline-edit-icon', {
            open: isOpen
          })}
          {...buttonProps}
          onClick={e => {
            e.stopPropagation()
            onClick()
          }}
        >
          <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
        </IconButton>
      )}
      renderMenu={({ close }) => {
        const closeMenu = (e: MouseEvent<HTMLButtonElement>) => {
          e?.stopPropagation()
          close()
        }

        return (
          <div
            onClick={e => {
              e.stopPropagation()
            }}
          >
            {column.renderInlineEdit!(
              { row, rowIndex, columnIndex, totalRows },
              closeMenu
            )}
          </div>
        )
      }}
    />
  )
}

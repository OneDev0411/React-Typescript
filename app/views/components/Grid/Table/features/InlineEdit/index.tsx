import {
  useState,
  forwardRef,
  MouseEvent,
  RefObject,
  useImperativeHandle,
  useCallback
} from 'react'

import { IconButton, Popover, Theme, useTheme } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import type { TableColumn } from '../../types'

interface Props<Row> {
  column: TableColumn<Row>
  rowIndex: number
  columnIndex: number
  totalRows: number
  row: Row
  innerRef?: RefObject<InlineEditRef>
  columnRef: RefObject<HTMLDivElement>
}

export interface InlineEditRef {
  handleOpen(): void
}

function InlineEdit<Row>({
  column,
  row,
  rowIndex,
  columnIndex,
  totalRows,
  innerRef,
  columnRef
}: Props<Row>) {
  const theme = useTheme<Theme>()
  const [isOpen, setIsOpen] = useState(false)

  const openMenu = () => setIsOpen(true)
  const closeMenu = useCallback(() => setIsOpen(false), [])

  useImperativeHandle(innerRef, () => ({
    handleOpen: openMenu
  }))

  const width = columnRef.current?.clientWidth ?? undefined
  const height = columnRef.current?.clientHeight ?? undefined

  return (
    <>
      <IconButton
        size="small"
        className={cn('inline-edit-icon', {
          open: isOpen
        })}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation()
          openMenu()
        }}
      >
        <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
      </IconButton>

      <Popover
        open={isOpen}
        anchorEl={columnRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        style={column.inlineEditStyles?.popover?.({
          width,
          height
        })}
        PaperProps={{
          style: column.inlineEditStyles?.paper
        }}
        onClose={closeMenu}
        {...column.inlineEditProps}
      >
        <div
          style={{
            minWidth: width,
            minHeight: height,
            border: `2px solid ${theme.palette.primary.main}`,
            ...column.inlineEditStyles?.container?.({
              width,
              height
            })
          }}
        >
          {column.renderInlineEdit!(
            { row, rowIndex, columnIndex, totalRows },
            closeMenu
          )}
        </div>
      </Popover>
    </>
  )
}

const InlineEditWithRef = forwardRef(InlineEdit)

export default function InlineEditable<Row>({
  innerRef,
  ...props
}: Props<Row>) {
  return <InlineEditWithRef innerRef={innerRef} {...props} />
}

import React, { useState } from 'react'
import { Popover, MenuItem } from '@material-ui/core'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import { GridSortingOption, TableColumn, SortableColumn } from '../../types'

import { useGridContext } from '../../hooks/use-grid-context'
import { setActiveSort } from '../../context/actions/sorting/set-active-sort'
import { StateContext } from '../../context'

interface Props<Row> {
  options: GridSortingOption | null
  columns: TableColumn<Row>[]
}

export function Sorting<Row>({ columns, options }: Props<Row>) {
  const [state, dispatch] = useGridContext()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  if (!options || options.sortBy !== undefined) {
    return null
  }

  const sortableColumns = getSortableColumns<Row>(columns, options)

  const handleToggleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (anchorEl) {
      setAnchorEl(null)

      return
    }

    event && setAnchorEl(event.currentTarget)
  }

  const handleChangeSort = (item: SortableColumn) => {
    setAnchorEl(null)

    setTimeout(() => {
      dispatch(
        setActiveSort({
          value: item.value,
          label: item.label,
          ascending: item.ascending
        })
      )

      options.onChange && options.onChange(item)
    }, 0)
  }

  return (
    <>
      <DropdownToggleButton
        isActive={Boolean(anchorEl)}
        onClick={handleToggleMenu}
      >
        {getActiveSortLabel(state)}
      </DropdownToggleButton>

      <Popover
        id={anchorEl ? 'sorting-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => handleToggleMenu()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        style={{ zIndex: 10 }}
      >
        {sortableColumns.map((item, index) => (
          <MenuItem
            key={index}
            value={item.value}
            selected={
              !!(
                state.sorting.activeSort &&
                state.sorting.activeSort.value === item.value &&
                state.sorting.activeSort.ascending === item.ascending
              )
            }
            onClick={() => handleChangeSort(item)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}

function getActiveSortLabel(state: StateContext) {
  if (!state.sorting.activeSort) {
    return '- Select Sort -'
  }

  return state.sorting.activeSort.label
}

function getSortLabel<Row>(
  column: TableColumn<Row>,
  ascending: boolean
): string {
  const lowText = column.sortType === 'number' ? 'Low' : 'A'
  const highText = column.sortType === 'number' ? 'High' : 'Z'

  let title = column.sortTitle

  if (!title && typeof column.header === 'string') {
    title = column.header
  }

  if (!title) {
    return ''
  }

  return ascending
    ? `${title} (${lowText}-${highText})`
    : `${title} (${highText}-${lowText})`
}

function getSortableColumns<Row>(
  columns: TableColumn<Row>[],
  options: GridSortingOption
): SortableColumn[] {
  const list: SortableColumn[] = []

  if (options.columns) {
    return options.columns
  }

  columns.forEach(column => {
    if (column.sortable === false || !column.accessor) {
      return
    }

    list.push(
      {
        label: getSortLabel<Row>(column, true),
        value: column.id,
        ascending: true
      },
      {
        label: getSortLabel<Row>(column, false),
        value: `-${column.id}`,
        ascending: false
      }
    )
  })

  return list
}

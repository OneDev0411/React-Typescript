import React from 'react'

import { Tooltip, createStyles, makeStyles, Theme } from '@material-ui/core'

import Checkbox from '../Selection/Checkbox'

import { ToggleEntireRows } from '../Selection/ToggleEntireRows'

import { useGridContext } from '../../hooks/use-grid-context'

import { SELECTION__TOGGLE_ALL } from '../../context/constants'
import { TableActionComponent } from '../../types'

interface Props<Row> {
  rows: Row[]
  totalRows: number
  TableActions: React.ReactType<TableActionComponent<Row>> | null
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      bottom: 0,
      border: '1px solid #F4F5F9',
      background: '#fff',
      position: 'sticky',
      height: theme.spacing(10),
      width: '100%',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1),
      zIndex: 99
    },
    summary: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    }
  })
)

export function Actions<Row>({ rows, TableActions, totalRows }: Props<Row>) {
  const classes = useStyles()
  const [state, dispatch] = useGridContext()

  if (
    !state.selection.isAllRowsSelected &&
    !state.selection.isEntireRowsSelected &&
    state.selection.selectedRowIds.length === 0
  ) {
    return null
  }

  const getSelectedCount = () => {
    if (state.selection.isEntireRowsSelected) {
      return totalRows - state.selection.excludedRows.length
    }

    return state.selection.isAllRowsSelected
      ? rows.length
      : state.selection.selectedRowIds.length
  }
  const toggleAll = () =>
    dispatch({
      type: SELECTION__TOGGLE_ALL,
      rows
    })

  const isAllRowsSelected =
    state.selection.isAllRowsSelected ||
    state.selection.selectedRowIds.length === rows.length ||
    (state.selection.isEntireRowsSelected &&
      state.selection.excludedRows.length === 0)

  const isSomeRowsSelected =
    (state.selection.isAllRowsSelected === false &&
      state.selection.selectedRowIds.length > 0 &&
      state.selection.selectedRowIds.length < rows.length) ||
    (state.selection.isEntireRowsSelected &&
      state.selection.excludedRows.length > 0)

  return (
    <div className={classes.container}>
      <Tooltip
        title={isAllRowsSelected ? 'Deselect All Rows' : 'Select All Rows'}
        placement="top"
      >
        <div>
          <Checkbox
            checked={isAllRowsSelected}
            indeterminate={isSomeRowsSelected}
            onChange={toggleAll}
          />

          <ToggleEntireRows<Row> rows={rows} totalRows={totalRows} />

          <span className={classes.summary} onClick={toggleAll}>
            {getSelectedCount()} of {totalRows} selected
          </span>
        </div>
      </Tooltip>

      <div>
        {TableActions && (
          <TableActions state={state} dispatch={dispatch} rows={rows} />
        )}
      </div>
    </div>
  )
}

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
      borderTop: `1px solid ${theme.palette.divider}`,
      background: theme.palette.common.white,
      position: 'sticky',
      height: theme.spacing(10),
      width: '100%',
      justifyContent: 'flex-start',
      padding: theme.spacing(0, 1),
      zIndex: theme.zIndex.gridAction
    },
    summary: {
      color: theme.palette.secondary.main,
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
  const tooltipTitle = isAllRowsSelected
    ? 'Deselect All Rows'
    : 'Select All Rows'

  return (
    <div className={classes.container}>
      <div>
        <Tooltip title={tooltipTitle} placement="top">
          <Checkbox
            checked={isAllRowsSelected}
            tooltipTitle={tooltipTitle}
            indeterminate={isSomeRowsSelected}
            onChange={toggleAll}
          />
        </Tooltip>

        <ToggleEntireRows<Row>
          rows={rows}
          totalRows={totalRows}
          tooltipTitle={tooltipTitle}
        />

        <span className={classes.summary} onClick={toggleAll}>
          {getSelectedCount()} of {totalRows} selected
        </span>
      </div>

      <div>
        {TableActions && (
          <TableActions state={state} dispatch={dispatch} rows={rows} />
        )}
      </div>
    </div>
  )
}

import React from 'react'

import { Tooltip, createStyles, makeStyles, Theme } from '@material-ui/core'
import Slide from '@material-ui/core/Slide'

import Checkbox from '../Selection/Checkbox'

import { ToggleEntireRows } from '../Selection/ToggleEntireRows'

import { useGridContext } from '../../hooks/use-grid-context'

import { SELECTION__TOGGLE_ALL } from '../../context/constants'

interface Props<Row> {
  rows: Row[]
  totalRows: number
  showSelectAll: boolean
  TableActions: React.ReactNode | null
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
    infoContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(5)
    },
    summary: {
      fontSize: theme.typography.body2.fontSize,
      color: theme.palette.tertiary.main,
      cursor: 'pointer'
    }
  })
)

export function Actions<Row>({
  rows,
  totalRows,
  TableActions,
  showSelectAll = true
}: Props<Row>) {
  const classes = useStyles()
  const [state, dispatch] = useGridContext()
  const {
    isAllRowsSelected,
    isEntireRowsSelected,
    selectedRowIds,
    excludedRows
  } = state.selection

  if (
    !isAllRowsSelected &&
    !isEntireRowsSelected &&
    selectedRowIds.length === 0
  ) {
    return null
  }

  const getSelectedCount = () => {
    if (isEntireRowsSelected) {
      return totalRows - excludedRows.length
    }

    return isAllRowsSelected ? rows.length : selectedRowIds.length
  }
  const toggleAll = () =>
    dispatch({
      type: SELECTION__TOGGLE_ALL,
      rows
    })

  const isAllSelected =
    isAllRowsSelected ||
    selectedRowIds.length === rows.length ||
    (isEntireRowsSelected && excludedRows.length === 0)

  const isSomeRowsSelected =
    (isAllRowsSelected === false &&
      selectedRowIds.length > 0 &&
      selectedRowIds.length < rows.length) ||
    (isEntireRowsSelected && excludedRows.length > 0)
  const tooltipTitle = isAllSelected ? 'Deselect All Rows' : 'Select All Rows'

  return (
    <Slide in direction="up">
      <div className={classes.container}>
        {showSelectAll && (
          <div className={classes.infoContainer}>
            <Tooltip title={tooltipTitle} placement="top">
              <Checkbox
                checked={isAllSelected}
                tooltipTitle={tooltipTitle}
                indeterminate={isSomeRowsSelected}
                onChange={toggleAll}
              />
            </Tooltip>

            <span className={classes.summary} onClick={toggleAll}>
              {getSelectedCount()} of {totalRows} selected
            </span>
            <ToggleEntireRows<Row> rows={rows} totalRows={totalRows} />
          </div>
        )}

        {TableActions && <div>{TableActions}</div>}
      </div>
    </Slide>
  )
}

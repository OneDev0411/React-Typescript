import React from 'react'

import {
  Tooltip,
  Slide,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

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
      position: 'sticky',
      bottom: 0,
      width: '100%',
      height: theme.spacing(10),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: theme.spacing(0, 2),
      background: theme.palette.grey[100],
      border: `1px solid ${theme.palette.divider}`,
      borderTopLeftRadius: `${theme.shape.borderRadius}px`,
      borderTopRightRadius: `${theme.shape.borderRadius}px`,
      boxShadow: `0 ${theme.spacing(-0.5)}px ${theme.spacing(2)}px ${fade(
        theme.palette.common.black,
        0.08
      )}`,
      zIndex: theme.zIndex.gridAction
    },
    infoContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(4)
    },
    actionsContainer: {
      flexGrow: 1
    },
    toggleAll: {
      padding: 0,
      marginRight: theme.spacing(1)
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

  if (rows.length === 0) {
    return null
  }

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
                className={classes.toggleAll}
              />
            </Tooltip>

            <span className={classes.summary} onClick={toggleAll}>
              {getSelectedCount()} of {totalRows} selected
            </span>
            <ToggleEntireRows<Row> rows={rows} totalRows={totalRows} />
          </div>
        )}

        {TableActions && (
          <div className={classes.actionsContainer}>{TableActions}</div>
        )}
      </div>
    </Slide>
  )
}

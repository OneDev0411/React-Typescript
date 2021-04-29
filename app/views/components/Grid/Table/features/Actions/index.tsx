import React from 'react'

import {
  Tooltip,
  Slide,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

import { mdiPlusCircleOutline } from '@mdi/js'

import Checkbox from '../Selection/Checkbox'

import { ToggleEntireRows } from '../Selection/ToggleEntireRows'

import { useGridContext } from '../../hooks/use-grid-context'

import { SELECTION__TOGGLE_ALL } from '../../context/constants'
import { GridActionButton } from './Button'

interface Props<Row> {
  rows: Row[]
  totalRows: number
  showSelectAll: boolean
  TableActions: React.ReactNode | null
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        position: 'sticky',
        bottom: `${theme.spacing(3.5)}px`,
        width: '100%',
        height: theme.spacing(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: theme.spacing(0, 2),
        background: theme.palette.tertiary.main,
        borderRadius: `${theme.spacing(2)}px`,
        boxShadow: `0 ${theme.spacing(0.5)}px ${theme.spacing(2)}px ${fade(
          theme.palette.common.black,
          0.4
        )}`,
        zIndex: theme.zIndex.gridAction
      },
      infoContainer: {
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(4)
      },
      actionsContainer: {
        display: 'flex',
        alignItems: 'center'
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
    }),
  {
    name: 'GridAction'
  }
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
        <GridActionButton label="Merge" icon={mdiPlusCircleOutline} />
        <GridActionButton label="Delete" icon={mdiPlusCircleOutline} />
        <GridActionButton label="Export" icon={mdiPlusCircleOutline} />
        <GridActionButton label="Flow" icon={mdiPlusCircleOutline} />
        {/* showSelectAll && (
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
        ) */}

        {/* TableActions && (
          <div className={classes.actionsContainer}>{TableActions}</div>
        ) */}
      </div>
    </Slide>
  )
}

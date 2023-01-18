import React from 'react'

import { Slide, createStyles, makeStyles, Theme } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { resetRows } from '../../context/actions/selection/reset-rows'
import { useGridContext } from '../../hooks/use-grid-context'

import { GridActionButton } from './Button'
import { useGridActionButtonStyles } from './use-grid-action-button-styles'

interface Props<Row> {
  rows: Row[]
  totalRows: number
  showSelectAll: boolean
  TableActions: React.ReactNode | null
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
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
        color: theme.palette.background.paper,
        ...theme.typography.h6
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
  const gridActionButtonClasses = useGridActionButtonStyles()

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
  const deselectAll = () => dispatch(resetRows())

  if (rows.length === 0) {
    return null
  }

  return (
    <Slide in direction="up">
      <div className={gridActionButtonClasses.root}>
        <GridActionButton
          label="Cancel"
          icon={mdiClose}
          onClick={deselectAll}
        />
        <GridActionButton
          label="Selected"
          textIcon={
            <span className={classes.summary}>{getSelectedCount()}</span>
          }
        />
        {TableActions || null}
      </div>
    </Slide>
  )
}

import React from 'react'

import { Slide, createStyles, makeStyles, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

import { mdiClose } from '@mdi/js'

import { useGridContext } from '../../hooks/use-grid-context'

import { resetRows } from '../../context/actions/selection/reset-rows'

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
      <div className={classes.container}>
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

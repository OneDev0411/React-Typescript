import React, { useEffect } from 'react'
import { Grid, Checkbox, Tooltip, Typography } from '@material-ui/core'
import pluralize from 'pluralize'

import {
  SELECTION__TOGGLE_ALL,
  SELECTION__RESET_ROWS
} from 'components/Grid/Table/context/constants'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'

import { AggregatedAgentInfo } from '../../types'

interface Props {
  rows: AggregatedAgentInfo[]
}

export function TableToolbar({ rows }: Props) {
  const [state, dispatch] = useGridContext()

  useEffect(() => {
    if (rows.length === 0) {
      return
    }

    dispatch({ type: SELECTION__RESET_ROWS })

    dispatch({
      type: SELECTION__TOGGLE_ALL,
      rows
    })
  }, [rows, dispatch])

  // No render until we get the rows!
  if (rows.length === 0) {
    return null
  }

  const isAllRowsSelected = state.selection.isAllRowsSelected
  const selectedRowsCount = state.selection.selectedRowIds.length
  const isSomeRowsSelected = !isAllRowsSelected && selectedRowsCount > 0

  const tooltipTitle = state.selection.isAllRowsSelected
    ? 'Deselect All'
    : 'Select All'

  const tableSummary =
    selectedRowsCount === 0
      ? pluralize('Agent', rows.length, true)
      : `${selectedRowsCount} of ${rows.length} selected`

  const handleToggleSelectionClick = () => {
    dispatch({
      type: SELECTION__TOGGLE_ALL,
      rows
    })
  }

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Tooltip title={tooltipTitle}>
          <Checkbox
            checked={isAllRowsSelected}
            indeterminate={isSomeRowsSelected}
            onChange={handleToggleSelectionClick}
          />
        </Tooltip>
      </Grid>
      <Grid item>
        <Typography variant="body2">{tableSummary}</Typography>
      </Grid>
    </Grid>
  )
}

import React, { useState } from 'react'
import {
  Popover,
  FormControlLabel,
  Tooltip,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import { SELECTION__TOGGLE_ENTIRE_ROWS } from '../../../context/constants'

import { useGridContext } from '../../../hooks/use-grid-context'

import Checkbox from '../Checkbox'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      padding: theme.spacing(0, 0.2),
      minWidth: theme.spacing(1),
      margin: theme.spacing(0, 1, 0, 0)
    },
    formControl: {
      padding: theme.spacing(0, 2)
    },
    popover: {
      zIndex: ++theme.zIndex.gridAction
    }
  })
)

interface Props<Row> {
  rows: Row[]
  totalRows: number
  tooltipTitle: string
}

export function ToggleEntireRows<Row>({
  rows,
  totalRows,
  tooltipTitle
}: Props<Row>) {
  const classes = useStyles()
  const [state, dispatch] = useGridContext()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleToggleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (anchorEl) {
      setAnchorEl(null)

      return
    }

    event && setAnchorEl(event.currentTarget)
  }

  const handleToggleEntireRows = () => {
    dispatch({
      type: SELECTION__TOGGLE_ENTIRE_ROWS
    })

    setAnchorEl(null)
  }

  if (rows && rows.length === totalRows) {
    return null
  }

  return (
    <>
      <Tooltip title={tooltipTitle} placement="top">
        <DropdownToggleButton
          onClick={handleToggleMenu}
          className={classes.button}
        />
      </Tooltip>

      <Popover
        id={anchorEl ? 'entire-row-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => handleToggleMenu()}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        className={classes.popover}
      >
        <FormControlLabel
          className={classes.formControl}
          control={
            <Checkbox
              checked={state.selection.isEntireRowsSelected}
              onChange={handleToggleEntireRows}
              indeterminate={
                state.selection.isEntireRowsSelected &&
                state.selection.excludedRows.length > 0
              }
            />
          }
          label={`select all ${totalRows} rows`}
        />
      </Popover>
    </>
  )
}

import React from 'react'
import { Tooltip, createStyles, makeStyles, Theme } from '@material-ui/core'

import { SELECTION__TOGGLE_ENTIRE_ROWS } from '../../../context/constants'

import { useGridContext } from '../../../hooks/use-grid-context'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      marginLeft: theme.spacing(1),
      color: theme.palette.secondary.main,
      fontSize: theme.typography.body1.fontSize,
      cursor: 'pointer'
    }
  })
)

interface Props<Row> {
  rows: Row[]
  totalRows: number
}

export function ToggleEntireRows<Row>({ rows, totalRows }: Props<Row>) {
  const classes = useStyles()
  const [state, dispatch] = useGridContext()
  const {
    selection: { isEntireRowsSelected }
  } = state
  const verbText = !isEntireRowsSelected ? 'Select' : 'Deselect'

  const handleToggleEntireRows = () => {
    dispatch({
      type: SELECTION__TOGGLE_ENTIRE_ROWS
    })
  }

  if (rows && rows.length === totalRows) {
    return null
  }

  return (
    <Tooltip title={`${verbText} all ${totalRows} rows`} placement="top">
      <span className={classes.formControl} onClick={handleToggleEntireRows}>
        ({`${verbText} All`})
      </span>
    </Tooltip>
  )
}

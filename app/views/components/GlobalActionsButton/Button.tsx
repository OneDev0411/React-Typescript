import React, { MouseEvent } from 'react'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'

interface Props {
  onMouseEnter: (event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: theme.spacing(15)
    }
  })
)

export default function GlobalActionsMenu({ onMouseEnter }: Props) {
  const classes = useStyles()

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onMouseEnter}
      onMouseEnter={onMouseEnter}
      size="large"
      classes={{
        root: classes.root
      }}
    >
      Actions
    </Button>
  )
}

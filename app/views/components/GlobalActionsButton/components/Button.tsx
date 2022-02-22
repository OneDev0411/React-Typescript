import React, { MouseEvent } from 'react'

import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'

interface Props {
  onClick: (event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(0, 1),
      marginBottom: theme.spacing(4)
    },
    root: {
      borderRadius: theme.shape.borderRadius,
      fontSize: theme.typography.body2.fontSize
    }
  })
)

export default function GlobalActionsMenu({ onClick }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        fullWidth
        onClick={onClick}
        classes={{
          root: classes.root
        }}
      >
        Create
      </Button>
    </div>
  )
}

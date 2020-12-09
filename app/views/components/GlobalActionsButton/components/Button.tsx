import React, { MouseEvent } from 'react'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'

import { mdiPlus } from '@mdi/js'

import { SvgIcon } from '../../SvgIcons/SvgIcon'

interface Props {
  onClick: (event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(0, 2.5),
      marginBottom: theme.spacing(3)
    },
    root: {
      borderRadius: '50px'
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
        <SvgIcon path={mdiPlus} rightMargined />
        Create
      </Button>
    </div>
  )
}

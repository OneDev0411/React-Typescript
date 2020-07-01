import React, { MouseEvent } from 'react'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'

import { mdiChevronDown } from '@mdi/js'

import { SvgIcon } from '../SvgIcons/SvgIcon'

interface Props {
  onClick: (event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: theme.spacing(20)
    }
  })
)

export default function GlobalActionsMenu({ onClick }: Props) {
  const classes = useStyles()

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      size="large"
      classes={{
        root: classes.root
      }}
    >
      Create
      <SvgIcon path={mdiChevronDown} />
    </Button>
  )
}

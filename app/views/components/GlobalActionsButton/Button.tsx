import React, { MouseEvent } from 'react'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'

import IconArrowDown from '../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

interface Props {
  onMouseEnter: (event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: theme.spacing(20)
    },
    icon: {
      fill: theme.palette.primary.contrastText,
      paddingTop: theme.spacing(0.6)
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
      size="large"
      classes={{
        root: classes.root
      }}
    >
      Actions
      <IconArrowDown className={classes.icon} />
    </Button>
  )
}

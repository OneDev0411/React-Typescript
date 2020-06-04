import React, { MouseEvent } from 'react'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import IconArrowDown from '../SvgIcons/ArrowDownKeyboard/IconArrowDownKeyboard'

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
  const theme = useTheme<Theme>()

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
      <IconArrowDown fillColor={theme.palette.primary.contrastText} />
    </Button>
  )
}

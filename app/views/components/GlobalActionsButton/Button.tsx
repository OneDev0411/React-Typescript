import React, { MouseEvent } from 'react'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import IconArrowDown from '../SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

interface Props {
  onClick: (event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: theme.spacing(20)
    },
    icon: {
      marginLeft: theme.spacing(0.5)
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
      Actions
      <IconArrowDown
        fill={theme.palette.primary.contrastText}
        className={classes.icon}
      />
    </Button>
  )
}

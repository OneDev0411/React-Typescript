import React from 'react'
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'

interface Props {
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      minWidth: theme.spacing(5)
    }
  })
)

export function EditButton(props: Props) {
  const { root: buttonClass } = useStyles()

  return (
    <Button
      variant="text"
      color="secondary"
      className={buttonClass}
      onClick={props.onClick}
    >
      Edit
    </Button>
  )
}

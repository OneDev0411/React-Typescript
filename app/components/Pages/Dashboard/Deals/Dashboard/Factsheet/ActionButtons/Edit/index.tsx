import React from 'react'
import { Button, createStyles, makeStyles } from '@material-ui/core'

interface Props {
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: 0,
      padding: 0
    }
  })
)

export function EditButton(props: Props) {
  const { root: buttonClass } = useStyles()

  return (
    <Button
      variant="text"
      color="primary"
      className={buttonClass}
      onClick={props.onClick}
    >
      Edit
    </Button>
  )
}

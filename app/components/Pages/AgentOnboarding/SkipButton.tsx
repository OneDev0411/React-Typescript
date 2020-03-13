import React from 'react'
import { Button, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1.5)
    },
    icon: {
      marginLeft: theme.spacing(1),
      fill: theme.palette.grey['900']
    }
  })
)

interface Props {
  to: string
}

export default function SkipButton({ to }: Props) {
  const classes = useStyles()

  return (
    <Button href={to} className={classes.button}>
      <span>Skip this step</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        className={classes.icon}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 0L6.6 1.4L12.2 7H0V9H12.2L6.6 14.6L8 16L16 8L8 0Z"
          fill="inhert"
        />
      </svg>
    </Button>
  )
}

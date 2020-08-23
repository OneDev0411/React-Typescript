import React from 'react'

import { Typography, makeStyles, Theme } from '@material-ui/core'

interface Props {
  icon: React.ReactNode
  text: string
  style?: React.CSSProperties
  isActive?: boolean
  onClick: () => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: ({ isActive }: { isActive: boolean }) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: isActive
        ? theme.palette.secondary.main
        : theme.palette.grey['700'],
      userSelect: 'none',
      '&:hover': {
        cursor: 'pointer',
        color: theme.palette.secondary.main
      }
    }),
    text: {
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'TextIconButton' }
)

export function TextIconButton({
  icon,
  text,
  style,
  isActive = false,
  onClick
}: Props) {
  const classes = useStyles({ isActive })

  return (
    <div className={classes.root} style={style} onClick={onClick}>
      {icon}
      <Typography variant="body2" className={classes.text}>
        {text}
      </Typography>
    </div>
  )
}

import React from 'react'
import { Link as RouterLink } from 'react-router'
import { Link, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import Icon from 'components/SvgIcons/LongArrowRight/IconLongArrowRight'

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    alignItems: 'center',
    display: 'inline-flex',
    position: 'absolute',
    right: theme.spacing(1.5),
    top: theme.spacing(1),
    '&:hover > svg': {
      fill: theme.palette.primary.dark
    }
  },
  icon: {
    fill: 'currentColor',
    marginLeft: theme.spacing(1)
  }
}))

interface Props {
  to: string
}

export default function SkipButton({ to }: Props) {
  const classes = useStyles()

  return (
    <Link
      className={classes.link}
      color="textPrimary"
      component={RouterLink}
      to={to}
    >
      <span>Skip this step</span>
      <Icon className={classes.icon} />
    </Link>
  )
}

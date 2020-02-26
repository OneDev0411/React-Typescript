import React from 'react'
import Chip from '@material-ui/core/Chip'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      chip: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        fontWeight: theme.typography.fontWeightBold
      }
    }),
  { name: 'crmTag' }
)

interface Props {
  text: string
}

export function Tag(props: Props) {
  const classes = useStyles()

  return <Chip label={props.text} className={classes.chip} variant="outlined" />
}

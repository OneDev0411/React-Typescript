import React from 'react'

import { Box, makeStyles, createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      badge: {
        borderRadius: '50%',
        width: 25,
        height: 25,
        padding: 2,
        background: '#009B6F',
        color: '#fff',
        textAlign: 'center',
        fontSize: 12,
        marginLeft: 5
      }
    }),
  { name: 'FilterButtonBadge' }
)

interface Props {
  value: number | string
}

const FilterButtonBadge = ({ value }: Props) => {
  const classes = useStyles()

  return <Box className={classes.badge}>{value}</Box>
}

export default FilterButtonBadge

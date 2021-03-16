import React from 'react'
import { Skeleton } from '@material-ui/lab'
import { Box, createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        display: 'flex',
        width: '100%',
        marginBottom: theme.spacing(1),
        padding: theme.spacing(1.5, 0),
        borderBottom: `1px solid ${theme.palette.divider}`
      },
      item: {
        '&:not(:last-child)': {
          marginRight: theme.spacing(1.5)
        }
      }
    }),
  { name: 'TabMarketingSkeleton' }
)

export const TabMarketingSkeleton = () => {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Skeleton
          key={i}
          variant="rect"
          height={20}
          width={90}
          className={classes.item}
        />
      ))}
    </Box>
  )
}

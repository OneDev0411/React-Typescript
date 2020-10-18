import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
          width: 'calc((100% - 30%) / 3)',
      display: 'flex',
      justifyContent: 'center',
          paddingRight: theme.spacing(6),
          paddingLeft: theme.spacing(6),
          borderRight: `1px solid ${theme.palette.grey[200]}`,
      alignItems: 'center',
      '&:first-child': {
          width: '30%',
          paddingLeft: 0,
        justifyContent: 'initial'
          },
          '&:last-child': {
              borderRight: 'none'
      }
    },
    value: {
      marginRight: theme.spacing(2)
    },
    chipsColorSecondary: {
      backgroundColor: theme.palette.error.main
    }
  }),
  { name: 'Stats' }
)

interface Props {
  title: string
  value: string
  change: number
}

export default function Stats({ title, value, change }: Props) {
  const classes = useStyles()
  const IsChangePositive = change > 0

  return (
    <Box className={classes.container}>
          <Box>
        <Typography variant="body1">{title}</Typography>
              <Box display="flex" alignItems="center">
          <Typography variant="h4" className={classes.value}>
            {value}
          </Typography>
          <Chip
            color={IsChangePositive ? 'primary' : 'secondary'}
            classes={{
              colorSecondary: classes.chipsColorSecondary
            }}
                      label={`${IsChangePositive ? '\u2191' : '\u2193'}${IsChangePositive ? change : change * -1
            }%`}
          />
        </Box>
      </Box>
    </Box>
  )
}

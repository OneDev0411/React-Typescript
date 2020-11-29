import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core'

import listingUtils from 'utils/listing'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: theme.spacing(1, 2),
      backgroundColor: theme.palette.grey['100'],
      borderRadius: '20px'
    },
    status: {
      width: 10,
      height: 10,
      borderRadius: '100%',
      marginRight: theme.spacing(1),
      backgroundColor: (props: Props) =>
        `#${listingUtils.getStatusColor(props.status)}`
    }
  }),
  { name: 'Status' }
)

interface Props {
  status: IListingStatus
}

function Title({ status }: Props) {
  const classes = useStyles({ status })

  return (
    <div className={classes.container}>
      <div className={classes.status} />
      <Typography variant="button">{status}</Typography>
    </div>
  )
}

export default Title

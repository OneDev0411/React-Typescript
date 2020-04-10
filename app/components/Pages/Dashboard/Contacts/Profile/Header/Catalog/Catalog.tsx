import React from 'react'
import { Box, Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LastTouched } from 'components/LastTouched'

import Avatar from './Avatar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginLeft: `${theme.spacing(1)}px`,
      width: 'calc(100% - 64px)'
    },
    name: {
      wordBreak: 'break-all'
    },
    editButton: {
      marginLeft: theme.spacing(1)
    },
    touch: {
      paddingLeft: theme.spacing(1.5),
      color: theme.palette.grey['900']
    }
  })
)

interface Props {
  contact: IContact
}

export default function Catalog({ contact }: Props) {
  const classes = useStyles()

  return (
    <Box mb={1}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar contact={contact} />
        <Box display="flex" alignItems="center" className={classes.title}>
          <Typography variant="subtitle1" className={classes.name}>
            {contact.display_name}
          </Typography>
          <Link
            color="secondary"
            href="#Details"
            variant="caption"
            className={classes.editButton}
          >
            Edit
          </Link>
        </Box>
      </Box>
      <div className={classes.touch}>
        <LastTouched contact={contact} />
      </div>
    </Box>
  )
}

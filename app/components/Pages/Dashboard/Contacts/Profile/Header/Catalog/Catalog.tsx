import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LastTouched } from 'components/LastTouched'

import Avatar from './Avatar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
      marginLeft: theme.spacing(1),
      width: 'calc(100% - 56px)'
    },
    editButton: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '0.875rem',
      marginLeft: theme.spacing(1)
    },
    touch: {
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
    <Box mb={2}>
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar contact={contact} />
        <Typography variant="h1" className={classes.title}>
          {contact.display_name}
          <a href="#Details" className={classes.editButton}>
            Edit
          </a>
        </Typography>
      </Box>
      <div className={classes.touch}>
        <LastTouched contact={contact} />
      </div>
    </Box>
  )
}

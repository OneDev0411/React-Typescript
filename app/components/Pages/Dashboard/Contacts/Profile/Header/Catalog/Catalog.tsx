import React from 'react'
import { Box, Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LastTouched } from 'components/LastTouched'

import Avatar from './Avatar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(1)
    },
    name: {
      wordBreak: 'break-all'
    },
    editButton: {
      marginLeft: theme.spacing(1)
    },
    touch: {
      color: theme.palette.grey['500']
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
      <Avatar contact={contact} />
      <Box className={classes.title}>
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
      <Box className={classes.touch}>
        <LastTouched contact={contact} />
      </Box>
    </Box>
  )
}

import React from 'react'
import { Box, Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import Tags from '../../Tags/TagsSection'

import Avatar from './Avatar'

import { Props } from '..'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    title: {
      display: 'flex',
      alignItems: 'center'
    },
    name: {
      wordBreak: 'break-all'
    },
    editButton: {
      marginLeft: theme.spacing(1)
    },
    tags: {
      color: theme.palette.grey['500']
    }
  })
)

export default function Catalog({
  contact,
  onTagChange
}: Omit<Props, 'handleCreateNote'>) {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Avatar contact={contact} />
      <Box pl={1}>
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
        <Box className={classes.tags}>
          <Tags contact={contact} onChange={onTagChange} />
        </Box>
      </Box>
    </Box>
  )
}

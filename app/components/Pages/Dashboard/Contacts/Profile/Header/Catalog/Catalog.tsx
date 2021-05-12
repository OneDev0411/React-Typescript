import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import Tags from '../../Tags/TagsSection'

import Avatar from './Avatar'
import { Social } from './Social'

import { Props } from '..'

const useStyles = makeStyles(
  (theme: Theme) => ({
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
    tags: {
      marginTop: theme.spacing(0.5)
    }
  }),
  { name: 'ContactProfileHeaderCatalog' }
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
          <Typography variant="h6" className={classes.name}>
            {contact.display_name}
          </Typography>
          <Box ml={1}>
            <Social contact={contact} />
          </Box>
        </Box>

        <Box className={classes.tags}>
          <Tags contact={contact} onChange={onTagChange} />
        </Box>
      </Box>
    </Box>
  )
}

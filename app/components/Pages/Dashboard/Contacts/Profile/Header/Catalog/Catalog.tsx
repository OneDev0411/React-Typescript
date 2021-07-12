import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import Tags from '../../Tags/TagsSection'

import Avatar from './Avatar'
import { Social } from './Social'

import { Props } from '..'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1
    },
    infoContainer: {
      paddingLeft: theme.spacing(1)
    },
    socialContainer: {
      marginLeft: theme.spacing(1)
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
    <div className={classes.container}>
      <Avatar contact={contact} />
      <div className={classes.infoContainer}>
        <div className={classes.title}>
          <Typography variant="h6" className={classes.name}>
            {contact.display_name}
          </Typography>
          <div className={classes.socialContainer}>
            <Social contact={contact} />
          </div>
        </div>

        <div className={classes.tags}>
          <Tags contact={contact} onChange={onTagChange} />
        </div>
      </div>
    </div>
  )
}

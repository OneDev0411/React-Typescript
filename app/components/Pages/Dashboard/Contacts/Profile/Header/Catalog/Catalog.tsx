import React from 'react'

import { Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { truncateTextFromMiddle } from '@app/utils/truncate-text-from-middle'

import { Props } from '..'
import Tags from '../../Tags/TagsSection'

import Avatar from './Avatar'
import { Social } from './Social'

const useStyles = makeStyles(
  (theme: Theme) => ({
    mainContainer: {
      display: 'grid',
      height: 'auto',
      gridTemplateAreas: 'avatarContainer profileContainer',
      gridTemplateColumns: '72px 2fr',
      gridTemplateRows: 'auto',
      gridColumnGap: theme.spacing(1),
      justifyItems: 'start',
      alignItems: 'center'
    },
    avatarContainer: {
      gridArea: 'avatarContainer',
      gridRow: '1 / span 2',
      gridColumn: '1 / span 1',
      height: 0,
      width: '100%',
      paddingBottom: '100%'
    },
    profileContainer: {
      gridArea: 'profileContainer',
      gridColumn: '2 / span 2',
      gridRow: '1 / span 1',
      width: '100%',
      height: 'auto'
    },
    displayNameContainer: {
      marginBottom: '.5rem',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    displayName: {
      wordBreak: 'break-all',
      marginRight: theme.spacing(1)
    },
    socialContainer: {
      display: 'flex',
      gap: theme.spacing(1)
    },
    tagsContainer: {
      gridRow: '2 / span 1'
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
    <div className={classes.mainContainer}>
      <div className={classes.avatarContainer}>
        <Avatar contact={contact} />
      </div>
      <div className={classes.profileContainer}>
        <div className={classes.displayNameContainer}>
          <Typography variant="h6" className={classes.displayName}>
            {truncateTextFromMiddle(contact.display_name, 200)}
          </Typography>
          <div className={classes.socialContainer}>
            <Social contact={contact} />
          </div>
        </div>
        <div className={classes.tagsContainer}>
          <Tags contact={contact} onChange={onTagChange} />
        </div>
      </div>
    </div>
  )
}

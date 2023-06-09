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
      display: 'flex',
      gap: theme.spacing(2),
      height: 'min-content',
      width: '100%',
      justifyItems: 'start',
      alignItems: 'center'
    },
    avatarContainer: {
      height: '72px',
      width: '100%',
      maxWidth: '72px'
    },
    profileContainer: {
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column',
      gap: theme.spacing(1)
    },
    displayNameContainer: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      height: 'max-content',
      gap: theme.spacing(1)
    },
    displayName: {
      wordBreak: 'break-all',
      height: 'max-content',
      fontSize: theme.typography.h5.fontSize
    },
    socialContainer: {
      width: 'min-content',
      height: 'max-content'
    },
    tagsContainer: {}
  }),
  { name: 'ContactProfileHeaderCatalog' }
)

export default function Catalog({
  contact,
  onChangeAvatar,
  contactChangeCallback
}: Omit<Props, 'onCreateNote' | 'onCreateEvent' | 'onUpdateTouchFreq'>) {
  const classes = useStyles()

  return (
    <div className={classes.mainContainer}>
      <div className={classes.avatarContainer}>
        <Avatar onChange={onChangeAvatar} contact={contact} />
      </div>
      <div className={classes.profileContainer}>
        <div className={classes.displayNameContainer}>
          <Typography variant="h6" className={classes.displayName}>
            {truncateTextFromMiddle(contact.display_name, 150)}
          </Typography>
          <div className={classes.socialContainer}>
            <Social contact={contact} />
          </div>
        </div>
        <div className={classes.tagsContainer}>
          <Tags contact={contact} onChange={contactChangeCallback} />
        </div>
      </div>
    </div>
  )
}

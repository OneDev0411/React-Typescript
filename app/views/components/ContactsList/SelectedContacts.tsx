import { Avatar, Box, makeStyles, Theme, Typography } from '@material-ui/core'

import { TextMiddleTruncate } from '../TextMiddleTruncate'

const useStyles = makeStyles(
  (theme: Theme) => ({
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 1),
      backgroundColor: '#fff',
      minHeight: theme.spacing(3),
      borderRadius: theme.shape.borderRadius * 3,
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5)
    },
    avatar: {
      width: theme.spacing(3),
      height: theme.spacing(3)
    }
  }),
  {
    name: 'ContactsList'
  }
)

interface Props {
  contacts: IContact[]
}

export function SelectedContacts({ contacts }: Props) {
  const classes = useStyles()

  return (
    <>
      {contacts.map(contact => (
        <div key={contact.id} className={classes.chip}>
          <Avatar
            src={contact.profile_image_url ?? ''}
            className={classes.avatar}
          >
            {contact.display_name[0]}
          </Avatar>
          <Box ml={1}>
            <Typography variant="body2">
              <TextMiddleTruncate text={contact.display_name} maxLength={15} />{' '}
            </Typography>
          </Box>
        </div>
      ))}
    </>
  )
}

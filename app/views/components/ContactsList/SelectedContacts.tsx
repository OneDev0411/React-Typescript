import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { getContactNameInitials } from '@app/models/contacts/helpers'

import { muiIconSizes, SvgIcon } from '../SvgIcons'
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
  onRemove: (id: UUID) => void
}

export function SelectedContacts({ contacts, onRemove }: Props) {
  const classes = useStyles()

  return (
    <>
      {contacts.map(contact => (
        <div key={contact.id} className={classes.chip}>
          <Avatar
            src={contact.profile_image_url ?? ''}
            className={classes.avatar}
          >
            {getContactNameInitials(contact)}
          </Avatar>
          <Box mx={1}>
            <Typography variant="body2">
              <TextMiddleTruncate text={contact.display_name} maxLength={15} />
            </Typography>
          </Box>

          <IconButton size="small" onClick={() => onRemove(contact.id)}>
            <SvgIcon path={mdiClose} size={muiIconSizes.small} />
          </IconButton>
        </div>
      ))}
    </>
  )
}

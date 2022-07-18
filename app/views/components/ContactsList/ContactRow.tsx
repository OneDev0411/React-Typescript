import {
  Avatar,
  Box,
  makeStyles,
  MenuItem,
  Theme,
  Typography
} from '@material-ui/core'

import { getContactNameInitials } from '@app/models/contacts/helpers'
import { truncateTextFromMiddle } from '@app/utils/truncate-text-from-middle'

const useStyles = makeStyles(
  (theme: Theme) => ({
    avatar: {
      width: theme.spacing(5),
      height: theme.spacing(5)
    },
    subtitle: {
      color: theme.palette.grey[500]
    }
  }),
  {
    name: 'ContactsList'
  }
)

interface Props {
  index: number
  style: React.CSSProperties
  data: {
    selectedContacts: IContact[]
    rows: IContact[]
    onSelectContact: (contact: IContact) => void
  }
}

export function ContactRow({
  index,
  style,
  data: { rows, selectedContacts, onSelectContact }
}: Props) {
  const contact = rows[index]
  const isDisabled = selectedContacts?.some(({ id }) => id === contact.id)
  const classes = useStyles()

  return (
    <MenuItem
      style={style}
      disabled={isDisabled}
      onClick={() => onSelectContact(contact)}
    >
      <Avatar src={contact.profile_image_url ?? ''} className={classes.avatar}>
        {getContactNameInitials(contact)}
      </Avatar>

      <Box ml={2}>
        <Typography variant="body1">{contact.display_name}</Typography>
        <Typography variant="body2" className={classes.subtitle}>
          {[truncateTextFromMiddle(contact.email, 30), contact.phone_number]
            .filter(item => !!item)
            .join(', ')}
        </Typography>
      </Box>
    </MenuItem>
  )
}

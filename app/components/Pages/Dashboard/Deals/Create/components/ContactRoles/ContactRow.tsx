import { Avatar, ListItemText, ListItemAvatar } from '@material-ui/core'

interface Props {
  contact: IContact
  primaryText: React.ReactNode
}

export function ContactRow({ contact, primaryText }: Props) {
  return (
    <>
      <ListItemAvatar>
        <Avatar src={contact.profile_image_url!} />
      </ListItemAvatar>
      <ListItemText primary={primaryText} secondary={contact.email} />
    </>
  )
}

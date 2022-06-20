import { Avatar, Box, makeStyles, Theme, Typography } from '@material-ui/core'

import { truncateTextFromMiddle } from '@app/utils/truncate-text-from-middle'

interface Props {
  index: number
  style: React.CSSProperties
  data: {
    rows: IContact[]
  }
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1)
    },
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

export function ContactRow({ index, style, data: { rows } }: Props) {
  const contact = rows[index]
  const classes = useStyles()

  return (
    <div style={style} className={classes.root}>
      <Avatar src={contact.profile_image_url ?? ''} className={classes.avatar}>
        {contact.display_name[0]}
      </Avatar>

      <Box ml={2}>
        <Typography variant="body1">{contact.display_name}</Typography>
        <Typography variant="body2" className={classes.subtitle}>
          {[truncateTextFromMiddle(contact.email, 30), contact.phone_number]
            .filter(item => !!item)
            .join(', ')}
        </Typography>
      </Box>
    </div>
  )
}

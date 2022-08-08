import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiClose, mdiHomeOutline } from '@mdi/js'

import { muiIconSizes, SvgIcon } from '../SvgIcons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginRight: theme.spacing(1),
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.shape.borderRadius * 4,
      marginBottom: theme.spacing(0.5)
    },
    avatar: {
      width: theme.spacing(2.5),
      height: theme.spacing(2.5)
    }
  }),
  {
    name: 'DealPropertyPicker-SelectedItemCard'
  }
)

interface Props {
  photo: string
  title: string
  onRemove: () => void
}

export function SelectedItemCard({ photo, title, onRemove }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Avatar className={classes.avatar} src={photo}>
        <SvgIcon path={mdiHomeOutline} />
      </Avatar>

      <Box mx={1}>
        <Typography variant="caption">{title}</Typography>
      </Box>

      <IconButton size="small" onClick={onRemove}>
        <SvgIcon path={mdiClose} size={muiIconSizes.small} />
      </IconButton>
    </div>
  )
}

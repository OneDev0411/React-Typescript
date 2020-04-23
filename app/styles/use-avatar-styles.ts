import { makeStyles, Theme } from '@material-ui/core'

interface Props {
  size?: number | string
}

export const useAvatarStyles = makeStyles(
  (theme: Theme) => ({
    avatar: {
      width: (props: Props) => props.size || theme.spacing(4),
      height: (props: Props) => props.size || theme.spacing(4),
      backgroundColor: theme.palette.grey['200'],
      color: theme.palette.grey['500']
    }
  }),
  { name: 'AvatarStyles' }
)

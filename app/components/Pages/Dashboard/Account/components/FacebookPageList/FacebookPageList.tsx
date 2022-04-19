import {
  ListItem,
  ListItemSecondaryAction,
  makeStyles,
  MenuList
} from '@material-ui/core'

import { useGetActiveBrandFacebookPages } from '@app/models/facebook'

import FacebookPageListDisconnectButton from './FacebookPageListDisconnectButton'
import FacebookPageListImageName from './FacebookPageListImageName'
import FacebookPageListLoadingState from './FacebookPageListLoadingState'

const useStyles = makeStyles(
  theme => ({
    row: {
      minHeight: theme.spacing(8),
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  }),
  { name: 'FacebookPageList' }
)

function FacebookPageList() {
  const classes = useStyles()
  const { data: pages, isLoading } = useGetActiveBrandFacebookPages()

  if (isLoading) {
    return <FacebookPageListLoadingState />
  }

  return (
    <MenuList disablePadding>
      {pages?.map(row => (
        <ListItem key={row.id} className={classes.row}>
          <FacebookPageListImageName
            image={row.instagram_profile_picture_url}
            name={row.instagram_username}
          />
          <ListItemSecondaryAction>
            <FacebookPageListDisconnectButton facebookPage={row} />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </MenuList>
  )
}

export default FacebookPageList

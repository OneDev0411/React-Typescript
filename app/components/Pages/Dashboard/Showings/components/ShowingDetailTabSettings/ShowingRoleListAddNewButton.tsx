import { List, ListItem, makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import ButtonMenu from '../ButtonMenu'
import { getShowingRoleLabel } from '../../helpers'

const useStyles = makeStyles(
  {
    width: { width: 200 }
  },
  { name: 'ShowingRoleListAddNewButton' }
)

interface ShowingRoleListAddNewButtonProps {
  onClick: (role: IShowingRoleType) => void
  disabled: boolean
}

function ShowingRoleListAddNewButton({
  onClick,
  disabled
}: ShowingRoleListAddNewButtonProps) {
  const classes = useStyles()

  return (
    <ButtonMenu
      className={classes.width}
      size="small"
      variant="outlined"
      color="default"
      startIcon={<AddIcon />}
      classes={{ paper: classes.width }}
      disabled={disabled}
      RenderMenu={() => (
        <List dense>
          <ListItem button onClick={() => onClick('CoSellerAgent')}>
            {getShowingRoleLabel('CoSellerAgent')}
          </ListItem>
          <ListItem button onClick={() => onClick('Tenant')}>
            {getShowingRoleLabel('Tenant')}
          </ListItem>
        </List>
      )}
    >
      Add New Participants
    </ButtonMenu>
  )
}

export default ShowingRoleListAddNewButton

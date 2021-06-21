import { List, ListItem, makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import ButtonMenu from '../ButtonMenu'
import { getShowingRoleLabel } from '../../helpers'

const useStyles = makeStyles(
  {
    width: { width: 200 }
  },
  { name: 'ShowingRoleAddNewButton' }
)

interface ShowingRoleAddNewButtonProps {
  onClick: (role: IShowingRoleType) => void
  disabled?: boolean
}

function ShowingRoleAddNewButton({
  onClick,
  disabled
}: ShowingRoleAddNewButtonProps) {
  const classes = useStyles()

  return (
    <ButtonMenu
      className={classes.width}
      type="button"
      size="small"
      variant="outlined"
      color="default"
      startIcon={<AddIcon />}
      classes={{ paper: classes.width }}
      disabled={disabled}
      RenderMenu={({ closeMenu }) => (
        <List dense>
          <ListItem
            button
            onClick={event => {
              onClick('CoSellerAgent')
              closeMenu(event)
            }}
          >
            {getShowingRoleLabel('CoSellerAgent')}
          </ListItem>
          <ListItem
            button
            onClick={event => {
              onClick('Tenant')
              closeMenu(event)
            }}
          >
            {getShowingRoleLabel('Tenant')}
          </ListItem>
        </List>
      )}
    >
      Add New Participants
    </ButtonMenu>
  )
}

export default ShowingRoleAddNewButton

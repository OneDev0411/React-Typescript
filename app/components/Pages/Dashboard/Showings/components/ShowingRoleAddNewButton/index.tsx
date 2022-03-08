import { List, ListItem, makeStyles } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { getShowingRoleLabel } from '../../helpers'
import ButtonMenu from '../ButtonMenu'

const useStyles = makeStyles(
  {
    width: { minWidth: 200 }
  },
  { name: 'ShowingRoleAddNewButton' }
)

export interface ShowingRoleAddNewButtonProps {
  onClick: (role: IShowingRoleType) => void
  disabled?: boolean
  label?: string
}

function ShowingRoleAddNewButton({
  onClick,
  disabled,
  label = 'Add New Participants'
}: ShowingRoleAddNewButtonProps) {
  const classes = useStyles()

  return (
    <ButtonMenu
      className={classes.width}
      type="button"
      size="small"
      variant="outlined"
      color="default"
      startIcon={<SvgIcon path={mdiPlus} size={muiIconSizes.small} />}
      classes={{ paper: classes.width }}
      disabled={disabled}
      RenderMenu={({ closeMenu }) => (
        <List dense>
          <ListItem
            button
            onClick={event => {
              onClick('Admin/Assistant')
              closeMenu(event)
            }}
          >
            {getShowingRoleLabel('Admin/Assistant')}
          </ListItem>
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
          <ListItem
            button
            onClick={event => {
              onClick('Other')
              closeMenu(event)
            }}
          >
            {getShowingRoleLabel('Other')}
          </ListItem>
        </List>
      )}
    >
      {label}
    </ButtonMenu>
  )
}

export default ShowingRoleAddNewButton

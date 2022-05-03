import { useContext } from 'react'

import { Button, Hidden, makeStyles, Theme } from '@material-ui/core'
import { mdiClose, mdiMenu } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { SideNavContext } from '../../DashboardLayout'

const useStyles = makeStyles(
  (theme: Theme) => ({
    toggleSideBar: {
      color: theme.palette.grey[500],
      marginTop: theme.spacing(1),
      width: theme.spacing(8)
    }
  }),
  { name: 'SideNavToggleButton' }
)

export function SideNavToggleButton() {
  const classes = useStyles()
  const { isDrawerOpen, onDrawerToggle } = useContext(SideNavContext)

  return (
    <Hidden mdUp>
      <Button
        className={classes.toggleSideBar}
        onClick={onDrawerToggle}
        size="small"
        variant="text"
      >
        <SvgIcon path={isDrawerOpen ? mdiClose : mdiMenu} />
      </Button>
    </Hidden>
  )
}

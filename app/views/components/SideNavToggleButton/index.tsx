import React from 'react'

import { Theme, IconButton, makeStyles } from '@material-ui/core'
import { mdiMenu } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useSideNavContext } from 'hooks/use-sidenav-context'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      marginRight: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    }
  }),
  {
    name: 'SideNavToggleButton'
  }
)

export function SideNavToggleButton() {
  const classes = useStyles()
  const sidenavContext = useSideNavContext()

  return (
    <IconButton
      className={classes.root}
      onClick={sidenavContext.onDrawerToggle}
    >
      <SvgIcon path={mdiMenu} size={muiIconSizes.large} />
    </IconButton>
  )
}

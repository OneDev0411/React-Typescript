import React, { ReactNode } from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { Box } from '@material-ui/core'
import { Theme, ButtonBase, makeStyles, createStyles } from '@material-ui/core'

import { mdiPlus } from '@mdi/js'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import SavedSearchesList from '../../SavedSearchesList'
import ViewSwitcher from '../GridControllers/ViewSwitcher'
import SortDrowndown from '../GridControllers/SortDropdown'

interface Props {
  onChangeView: () => void
  onChangeSort: () => void
  saveSearchHandler: () => void
  activeView: 'map' | 'grid' | 'list'
  isWidget: boolean
  isFetching: boolean
  user: IUser
  activeSort: string
  showSavedSearchButton?: false
}

interface TabsShape {
  label: string
  to: string
  component?: ReactNode
  allowAnonymousAccess: boolean
}

const useStyle = makeStyles(
  (theme: Theme) =>
    createStyles({
      saveSearch: {
        color: theme.palette.secondary.main,
        '&:disabled': {
          opacity: 0.6
        }
      },
      boxSwitcher: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'flex-end',
        marginBottom: theme.spacing(1),
        paddingLeft: theme.spacing(5)
      }
    }),
  { name: 'TabParts' }
)

const tabLinks: TabsShape[] = [
  {
    label: 'All Properties',
    to: '/dashboard/mls',
    allowAnonymousAccess: true
  },
  {
    label: 'Favorites',
    to: '/dashboard/mls/favorites',
    allowAnonymousAccess: false
  }
]

export const Tabs = ({
  user,
  onChangeView,
  activeView,
  isWidget,
  onChangeSort,
  activeSort,
  isFetching,
  saveSearchHandler,
  showSavedSearchButton,
  location
}: Props & WithRouterProps) => {
  const currentUrl = location.pathname
  const classes = useStyle()

  let availableTabs: React.ReactNode[]

  availableTabs = tabLinks.map(({ label, to, allowAnonymousAccess }, i) => {
    return (
      (user || allowAnonymousAccess) &&
      !isWidget && <TabLink key={i} label={label} to={to} value={to} />
    )
  })

  if (user && !isWidget) {
    availableTabs.push(
      <Tab
        key="saved-list"
        value="saved-searches"
        label={<SavedSearchesList />}
      />
    )
  }

  const saveSearchTab = (
    <Tab
      key="save"
      label={
        <>
          <ButtonBase
            className={classes.saveSearch}
            disabled={isFetching}
            onClick={saveSearchHandler}
          >
            <SvgIcon path={mdiPlus} size={muiIconSizes.small} rightMargined />
            Save Search
          </ButtonBase>
        </>
      }
    />
  )

  if (showSavedSearchButton && !isWidget && user && !isFetching) {
    availableTabs.push(saveSearchTab)
  }

  return (
    <Box display="flex">
      <Box flexGrow="1">
        <PageTabs
          defaultValue={currentUrl}
          tabs={availableTabs}
          value={
            currentUrl.includes('saved-searches') ? 'saved-searches' : null
          }
        />
      </Box>
      <Box className={classes.boxSwitcher}>
        <SortDrowndown onChangeSort={onChangeSort} activeSort={activeSort} />
        {!isWidget && user && (
          <ViewSwitcher onChangeView={onChangeView} activeView={activeView} />
        )}
      </Box>
    </Box>
  )
}

export default withRouter(Tabs)

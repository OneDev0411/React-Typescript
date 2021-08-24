import React, { ReactNode } from 'react'

import {
  Box,
  Theme,
  ButtonBase,
  makeStyles,
  createStyles
} from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import { withRouter, WithRouterProps } from 'react-router'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { SortIndex, SortString } from '../../helpers/sort-utils'
import { SortDropdown } from '../GridControllers/SortDropdown'
import ViewSwitcher from '../GridControllers/ViewSwitcher'
import SavedSearchesList from '../SavedSearchesList'

interface Props {
  onChangeView: (e: any) => void
  onChangeSort: (sort: SortString) => void
  saveSearchHandler: () => void
  activeView: 'map' | 'list'
  isWidget: boolean
  isFetching: boolean
  user: IUser
  activeSort: { index: SortIndex; ascending: boolean }
  showSavedSearchButton?: boolean
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
    to: '/dashboard/properties',
    allowAnonymousAccess: true
  },
  {
    label: 'Favorites',
    to: '/dashboard/properties/favorites',
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
            component="div"
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
    <Box display={{ xs: 'none', md: 'flex' }}>
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
        <SortDropdown onChangeSort={onChangeSort} activeSort={activeSort} />
        {!isWidget && user && (
          <ViewSwitcher onChangeView={onChangeView} activeView={activeView} />
        )}
      </Box>
    </Box>
  )
}

export default withRouter(Tabs)

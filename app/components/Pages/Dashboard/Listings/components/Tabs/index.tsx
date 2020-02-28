import React, { ReactNode } from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { Box } from '@material-ui/core'
import { Theme, ButtonBase, makeStyles, createStyles } from '@material-ui/core'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import AddIcon from 'components/SvgIcons/Add/AddIcon'

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

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    saveSearch: {
      color: theme.palette.secondary.main,
      '& svg': {
        fill: theme.palette.secondary.main
      },
      '&:disabled': {
        opacity: 0.6
      }
    },
    boxSwitcher: {
      margin: theme.spacing(1, 0),
      display: 'flex',
      flexGrow: 1,
      borderBottom: `2px solid ${theme.palette.divider}`,
      justifyContent: 'flex-end'
    }
  })
)

const tabLinks: TabsShape[] = [
  {
    label: 'All properties',
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
  // const currentUrl = location.pathname
  const currentUrl = '/dashboard/mls'
  const classes = useStyle()
  let availableTabs: React.ReactNode[]

  availableTabs = tabLinks.map(({ label, to, allowAnonymousAccess }, i) => {
    return (
      (user || allowAnonymousAccess) && (
        <TabLink key={i} label={label} to={to} value={to} />
      )
    )
  })

  if (user) {
    availableTabs.push(<Tab key="saved-list" label={<SavedSearchesList />} />)
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
            <AddIcon
              style={{
                fill: 'currentColor',
                width: 16,
                height: 16,
                marginRight: '.3rem'
              }}
            />
            Save current selection
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
        <PageTabs defaultValue={currentUrl} tabs={availableTabs} />
      </Box>
      <Box className={classes.boxSwitcher}>
        <SortDrowndown onChangeSort={onChangeSort} activeSort={activeSort} />
        {!isWidget && (
          <ViewSwitcher onChangeView={onChangeView} activeView={activeView} />
        )}
      </Box>
    </Box>
  )
}

export default withRouter(Tabs)

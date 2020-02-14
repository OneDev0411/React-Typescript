import React, { ReactNode } from 'react'
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
}

interface TabsShape {
  label: string
  to: string
  component?: ReactNode
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

const tabs: TabsShape[] = [
  {
    label: 'All properties',
    to: '/dashboard/mls'
  },
  {
    label: 'Favorites',
    to: '/dashboard/mls/favorites'
  }
]

export const Tabs = ({
  user,
  onChangeView,
  activeView,
  isWidget,
  isFetching,
  onChangeSort,
  saveSearchHandler
}: Props) => {
  const currentUrl = window.location.pathname
  const classes = useStyle()
  const linkTabs = tabs.map(({ label, to }, i) => {
    return <TabLink key={i} label={label} to={to} value={to} />
  })

  return (
    <Box display="flex">
      <Box flexGrow="1">
        <PageTabs
          defaultValue={currentUrl}
          tabs={[
            ...linkTabs,
            <Tab key="saved-list" label={<SavedSearchesList />} />,
            <Tab
              key="save"
              label={
                <>
                  {!isWidget && user && (
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
                      Save Search
                    </ButtonBase>
                  )}
                </>
              }
            />
          ]}
        />
      </Box>
      <Box className={classes.boxSwitcher}>
        <SortDrowndown onChangeSort={onChangeSort} />
        {!isWidget && (
          <ViewSwitcher onChangeView={onChangeView} activeView={activeView} />
        )}
      </Box>
    </Box>
  )
}

export default Tabs

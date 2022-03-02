/*
  Basically, this component should be independent like as it was before
  But unfortunately I had to make some changes on it due to hokm hokumati :(
*/
import { useState } from 'react'

import { Tabs, Tab, Theme, makeStyles } from '@material-ui/core'

import { useAvailableTeamsToSwitch } from '../../hooks/use-available-teams-to-switch'

import { BaseTreeViewBrandSelector } from './components/BaseTreeViewBrandSelector'
import { BaseBrandSelectorProps } from './type'

enum View {
  AllTeams = 'all-teams',
  UserTeams = 'user-teams'
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    filterSwitcher: {
      marginBottom: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  }),
  { name: 'BaseBrandAvailableToUserSelector' }
)

export function BaseBrandAvailableToUserSelector(
  props: BaseBrandSelectorProps
) {
  const classes = useStyles()
  const [view, setView] = useState<View>(View.UserTeams)
  const {
    isError,
    allTeams,
    userTeams,
    isLoading,
    searchTerm,
    allTeamInitialExpandedNodes,
    handleSearch
  } = useAvailableTeamsToSwitch()

  const handleChangeFilter = (_, view: View) => setView(view)

  const renderTreeView = () => {
    const commonProps = {
      isError,
      isLoading,
      searchTerm,
      handleSearch
    }

    if (view === View.AllTeams) {
      return (
        <BaseTreeViewBrandSelector
          {...commonProps}
          {...props}
          searchPlaceholder="Search for teams"
          initialExpandedNodes={allTeamInitialExpandedNodes}
          nodes={allTeams}
        />
      )
    }

    return (
      <BaseTreeViewBrandSelector
        {...commonProps}
        {...props}
        searchPlaceholder="Search my accounts"
        initialExpandedNodes={[]}
        nodes={userTeams}
      />
    )
  }

  return (
    <>
      <Tabs
        value={view}
        onChange={handleChangeFilter}
        indicatorColor="primary"
        textColor="primary"
        className={classes.filterSwitcher}
        variant="fullWidth"
        centered
      >
        <Tab value={View.UserTeams} disabled={isLoading} label="My Accounts" />
        <Tab value={View.AllTeams} disabled={isLoading} label="All Accounts" />
      </Tabs>
      {renderTreeView()}
    </>
  )
}

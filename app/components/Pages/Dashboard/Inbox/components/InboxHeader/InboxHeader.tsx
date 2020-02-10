import React from 'react'
import { Theme, Grid, Input, Button, Tabs, Tab } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import PageHeader from 'components/PageHeader'

import { InboxFilterTabCode } from './types'
import { filterTabs } from './constants'

const useStyles = makeStyles(
  (theme: Theme) => ({
    filterTabs: {
      borderBottom: '1px solid #d4d4d4'
    },
    filterTabsIndicator: {
      maxWidth: 28,
      marginLeft: 32
    },
    filterTab: {
      minWidth: 90,
      paddingLeft: 0,
      paddingRight: 0
    },
    filterTabSelected: {
      fontWeight: 'bold',
      color: theme.palette.primary.main
    }
  }),
  { name: 'InboxHeader' }
)

interface Props {
  filterTabsDisabled?: boolean
  filterTabCode: InboxFilterTabCode
  onFilterTabChange(filterTabCode: InboxFilterTabCode): void
}

export default function InboxHeader({
  filterTabsDisabled,
  filterTabCode,
  onFilterTabChange
}: Props) {
  const classes = useStyles()

  return (
    <>
      <PageHeader>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Inbox</PageHeader.Heading>
        </PageHeader.Title>
        <PageHeader.Menu>
          <Grid container spacing={3}>
            <Grid item>
              <Input margin="dense" placeholder="Search Emails" />
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained">
                Actions
              </Button>
            </Grid>
          </Grid>
        </PageHeader.Menu>
      </PageHeader>
      <Tabs
        indicatorColor="primary"
        classes={{
          root: classes.filterTabs,
          indicator: classes.filterTabsIndicator
        }}
        disabled={filterTabsDisabled}
        value={filterTabCode}
        onChange={(e, value) => onFilterTabChange(value)}
      >
        {filterTabs
          .filter(({ visible }) => visible)
          .map(({ code, title }) => (
            <Tab
              key={code}
              value={code}
              label={title}
              classes={{
                root: classes.filterTab,
                selected: classes.filterTabSelected
              }}
            />
          ))}
      </Tabs>
    </>
  )
}

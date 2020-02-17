import React from 'react'
import { Theme, Tabs, Tab } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import PageHeader from 'components/PageHeader'
import SendEmailButton from 'components/SendEmailButton'

import { InboxFilterTabCode } from './types'
import { filterTabs } from './constants'

const useStyles = makeStyles(
  (theme: Theme) => ({
    filterTabs: {
      borderBottom: `1px solid ${theme.palette.grey.A100}`
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
      <PageHeader isFlat>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Inbox</PageHeader.Heading>
        </PageHeader.Title>
        <PageHeader.Menu>
          <SendEmailButton appearance="primary" title="Send New Email" />
        </PageHeader.Menu>
      </PageHeader>
      <Tabs
        indicatorColor="primary"
        classes={{
          root: classes.filterTabs,
          indicator: classes.filterTabsIndicator
        }}
        value={filterTabCode}
        onChange={(e, value) => onFilterTabChange(value)}
        disabled={filterTabsDisabled}
      >
        {filterTabs
          .filter(({ visible }) => visible)
          .map(({ code, title }) => (
            <Tab
              key={code}
              value={code}
              label={title}
              disabled={filterTabsDisabled}
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

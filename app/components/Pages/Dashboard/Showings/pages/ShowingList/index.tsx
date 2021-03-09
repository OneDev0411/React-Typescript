import React, { memo } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import ShowingTabs, { ShowingTabsProps } from '../../components/ShowingTabs'

import { showingTabs } from '../../constants'

type ShowingProps = RouteComponentProps<{ type?: ShowingTabsProps['type'] }, {}>

function ShowingList({ params }: ShowingProps) {
  useTitle('Showings | Rechat')

  const type = params.type || showingTabs.Live

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Showings" />
      <PageLayout.Main>
        <ShowingTabs type={type} />
        <TabContentSwitch.Container value={type}>
          <TabContentSwitch.Item value={showingTabs.Live}>
            Live showings
          </TabContentSwitch.Item>
          <TabContentSwitch.Item value={showingTabs.All}>
            All showings
          </TabContentSwitch.Item>
          <TabContentSwitch.Item value={showingTabs.Offline}>
            Offline showings
          </TabContentSwitch.Item>
        </TabContentSwitch.Container>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(ShowingList)

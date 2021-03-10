import React, { memo } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import ShowingTabs, { ShowingTabsProps } from '../../components/ShowingTabs'

import { showingTabs } from '../../constants'
import ShowingTabLive from '../../components/ShowingTabLive'
import ShowingTabAll from '../../components/ShowingTabAll'
import ShowingTabOffline from '../../components/ShowingTabOffline'

type ShowingProps = RouteComponentProps<{ type?: ShowingTabsProps['type'] }, {}>

function Showings({ params }: ShowingProps) {
  useTitle('Showings | Rechat')

  const type = params.type || showingTabs.Live

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Showings" />
      <PageLayout.Main>
        <ShowingTabs type={type} />
        <TabContentSwitch.Container value={type}>
          <TabContentSwitch.Item value={showingTabs.Live}>
            <ShowingTabLive />
          </TabContentSwitch.Item>
          <TabContentSwitch.Item value={showingTabs.All}>
            <ShowingTabAll />
          </TabContentSwitch.Item>
          <TabContentSwitch.Item value={showingTabs.Offline}>
            <ShowingTabOffline />
          </TabContentSwitch.Item>
        </TabContentSwitch.Container>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)

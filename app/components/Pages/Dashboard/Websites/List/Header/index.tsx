import React from 'react'

import PageHeader from 'components/PageHeader'
import { Trigger as MenuTrigger } from 'components/SlideMenu'

interface Props {
  onToggleSidenav(): void
}

export function Header(props: Props) {
  return (
    <PageHeader>
      <PageHeader.Title showBackButton={false}>
        <MenuTrigger onClick={props.onToggleSidenav} />
        <PageHeader.Heading>My Websites</PageHeader.Heading>
      </PageHeader.Title>
    </PageHeader>
  )
}

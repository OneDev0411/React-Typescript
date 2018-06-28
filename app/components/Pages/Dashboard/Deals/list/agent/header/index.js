import React from 'react'

import PageHeader from '../../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'

import { Trigger as MenuTrigger } from '../../../../../../../views/components/SlideMenu'

const Header = ({ isSideMenuOpen, onMenuTriggerChange }) => (
  <PageHeader isFlat>
    <PageHeader.Title backButton={false}>
      <MenuTrigger
        tooltip={isSideMenuOpen ? 'Collapse Menu' : 'Expand Menu'}
        onClick={onMenuTriggerChange}
      />
      <PageHeader.Heading>Deals</PageHeader.Heading>
    </PageHeader.Title>

    <PageHeader.Menu>
      <ActionButton>Create New Deal</ActionButton>
    </PageHeader.Menu>
  </PageHeader>
)

export default Header

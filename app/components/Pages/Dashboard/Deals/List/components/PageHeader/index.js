import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'

import PageHeader from 'components/PageHeader'
import { Trigger as MenuTrigger } from 'components/SlideMenu'
// import ActionButton from 'components/Button/ActionButton'
import GlobalActionsButton from 'components/GlobalActionsButton'

// import ExportDeals from './ExportDeals'

export const Header = ({
  // user,
  title,
  isSideMenuOpen,
  onMenuTriggerChange
}) => (
  <PageHeader isFlat>
    <PageHeader.Title showBackButton={false}>
      <MenuTrigger isExpended={isSideMenuOpen} onClick={onMenuTriggerChange} />
      <PageHeader.Heading>{title}</PageHeader.Heading>
    </PageHeader.Title>

    <PageHeader.Menu>
      {/* <ExportDeals user={user} /> */}

      {/* <ActionButton
        data-test="create-deal-button"
        style={{ marginLeft: '1rem' }}
        onClick={() => browserHistory.push('/dashboard/deals/create')}
      >
        Create New Deal
      </ActionButton> */}
      <GlobalActionsButton />
    </PageHeader.Menu>
  </PageHeader>
)

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(Header)

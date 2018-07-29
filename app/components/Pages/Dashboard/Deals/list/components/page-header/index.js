import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageHeader from '../../../../../../../views/components/PageHeader'
import ToolTip from '../../../../../../../views/components/tooltip'
import { Trigger as MenuTrigger } from '../../../../../../../views/components/SlideMenu'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import ExportDeals from './ExportDeals'

const Header = ({
  user,
  isSideMenuOpen,
  onMenuTriggerChange,
  showCreateDeal = true
}) => (
  <PageHeader isFlat>
    <PageHeader.Title backButton={false}>
      <MenuTrigger
        tooltip={isSideMenuOpen ? 'Collapse Menu' : 'Expand Menu'}
        onClick={onMenuTriggerChange}
      />
      <PageHeader.Heading>Deals</PageHeader.Heading>
    </PageHeader.Title>

    <PageHeader.Menu>
      <ExportDeals user={user} />

      {showCreateDeal && (
        <ActionButton
          onClick={() => browserHistory.push('/dashboard/deals/create')}
        >
          Create New Deal
        </ActionButton>
      )}
    </PageHeader.Menu>
  </PageHeader>
)

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(Header)

import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PageHeader from '../../../../../../../views/components/PageHeader'
import ToolTip from '../../../../../../../views/components/tooltip'

// import Excel from '../../../../Partials/Svgs/Excel'

import { Trigger as MenuTrigger } from '../../../../../../../views/components/SlideMenu'

import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import { getActiveTeamId } from '../../../../../../../utils/user-teams'

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
      {/* <ToolTip placement="bottom" caption="Download Report">
        <a
          href={`/api/deals/export/${getActiveTeamId(user)}`}
          className="search-button"
        >
          <Excel />
        </a>
      </ToolTip> */}

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

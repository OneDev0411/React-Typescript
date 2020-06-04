import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { Button } from '@material-ui/core'

import PageHeader from 'components/PageHeader'
import { Trigger as MenuTrigger } from 'components/SlideMenu'

import ExportDeals from './ExportDeals'

export const Header = ({
  user,
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
      <ExportDeals user={user} />

      <Button
        data-test="create-deal-button"
        variant="contained"
        color="secondary"
        style={{ marginLeft: '1rem' }}
        onClick={() => browserHistory.push('/dashboard/deals/create')}
      >
        Create New Deal
      </Button>
    </PageHeader.Menu>
  </PageHeader>
)

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(Header)

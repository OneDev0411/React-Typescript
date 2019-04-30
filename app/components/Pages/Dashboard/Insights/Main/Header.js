import React from 'react'
import { browserHistory } from 'react-router'

import Tooltip from 'components/tooltip'
import SendEmailButton from 'components/SendEmailButton'

import PageHeader from '../../../../../views/components/PageHeader'

import ActionButton from '../../../../../views/components/Button/ActionButton'

import { Trigger as MenuTrigger } from '../../../../../views/components/SlideMenu'

export function Header({ title, isSideMenuOpen, onMenuTriggerChange }) {
  return (
    <PageHeader>
      <PageHeader.Title showBackButton={false}>
        <MenuTrigger
          isExpended={isSideMenuOpen}
          onClick={onMenuTriggerChange}
        />
        <PageHeader.Heading>{title}</PageHeader.Heading>
      </PageHeader.Title>

      <PageHeader.Menu>
        <Tooltip placement="bottom">
          <ActionButton
            appearance="outline"
            style={{ marginRight: '1em' }}
            onClick={() => browserHistory.push('/dashboard/marketing')}
          >
            Visit Marketing Center
          </ActionButton>
        </Tooltip>

        <SendEmailButton appearance="primary" title="Send New Email" />
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header

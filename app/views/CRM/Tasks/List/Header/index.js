import React from 'react'
import { browserHistory } from 'react-router'
import PageHeader from '../../../../components/PageHeader'
import ActionButton from '../../../../components/Button/ActionButton'

export default function Header() {
  return (
    <PageHeader title="Tasks" backButton={false}>
      <PageHeader.Menu>
        <ActionButton onClick={() => browserHistory.push('/crm/tasks/new')}>
          Create Task
        </ActionButton>
      </PageHeader.Menu>
    </PageHeader>
  )
}

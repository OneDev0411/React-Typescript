import React from 'react'
import PageHeader from '../../../../components/PageHeader'
import ActionButton from '../../../../components/Button/ActionButton'

export default function Header({ onCreateTask }) {
  return (
    <PageHeader title="Tasks" backButton={false}>
      <PageHeader.Menu>
        <ActionButton onClick={onCreateTask}>Create Task</ActionButton>
      </PageHeader.Menu>
    </PageHeader>
  )
}

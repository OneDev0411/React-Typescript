import React from 'react'
import { browserHistory } from 'react-router'
import ActionButton from '../../../../../components/Button/ActionButton'
import IconTodo from '../../../../../components/SvgIcons/Todo/IconTodo'

export default function NoTasks() {
  return (
    <div style={{ textAlign: 'center' }}>
      <IconTodo style={{ width: 112, height: 112, fill: '#8DA2B5' }} />
      <h2 style={{ color: '#62778c', margin: '0 0 0.5em' }}>
        Looks like you don’t have any tasks.
      </h2>
      <ActionButton onClick={() => browserHistory.push('/crm/tasks/new')}>
        Create Task
      </ActionButton>
    </div>
  )
}

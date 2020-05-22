import React, { useState } from 'react'
import { connect } from 'react-redux'

import { IAppState } from 'reducers'

import { selectDealTasks } from 'reducers/deals/tasks'

import { ChecklistFolder } from '../Checklist'

interface StateProps {
  tasks: IDealTask[]
}

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

function MarketingChecklist(props: Props & StateProps) {
  const [isFolderExpanded, setIsFolderExpanded] = useState<boolean>(true)
  const tasks = props.tasks.filter(task =>
    ['YardSign', 'OpenHouse', 'Media'].includes(task.task_type)
  )

  if (tasks.length === 0) {
    return null
  }

  return (
    <ChecklistFolder
      checklist={null}
      deal={props.deal}
      tasks={tasks}
      title="Marketing"
      isBackOffice={props.isBackOffice}
      createNewTask={false}
      onToggleExpand={() => setIsFolderExpanded(!isFolderExpanded)}
      isFolderExpanded={isFolderExpanded}
    />
  )
}

export default connect(({ deals }: IAppState, props: Props) => ({
  tasks: selectDealTasks(props.deal, deals.checklists, deals.tasks)
}))(MarketingChecklist)

import React from 'react'
import { connect } from 'react-redux'
import List from './list'

const Checklist = ({
  deal,
  selectedTaskId,
  onSelectTask,
  checklists
}) => (
  <div className="tasks-container">
    {
      (deal && deal.checklists) &&
      deal.checklists
      .map(id =>
        <List
          key={id}
          dealId={deal.id}
          section={checklists[id]}
          selectedTaskId={selectedTaskId}
          onSelectTask={onSelectTask}
        />
      )
    }
  </div>
)

export default connect(({ deals }) => ({
  checklists: deals.checklists
}))(Checklist)

import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { Container } from './styled'
import ChecklistFolder from './ChecklistFolder'

import { isBackOffice } from 'utils/user-teams'

class ChecklistTab extends React.Component {
  state = {
    showTerminatedChecklists: false,
    showDeactivatedChecklists: false
  }

  get Checklists() {
    let terminatedChecklistsCount = 0
    let deactivatedChecklistsCount = 0

    const checklists = _.chain(this.props.deal.checklists)
      .sortBy(id => {
        const checklist = this.props.checklists[id]

        if (checklist.is_terminated) {
          terminatedChecklistsCount += 1

          return 1000
        }

        if (checklist.is_deactivated) {
          deactivatedChecklistsCount += 1

          return 2000
        }

        return checklist.order
      })
      .filter(id => {
        const checklist = this.props.checklists[id]

        if (checklist.is_deactivated && !checklist.is_terminated) {
          return this.state.showDeactivatedChecklists
        }

        return this.state.showTerminatedChecklists
          ? true
          : checklist.is_terminated === false
      })
      .map(id => this.props.checklists[id])
      .value()

    return {
      checklists,
      terminatedChecklistsCount,
      deactivatedChecklistsCount
    }
  }

  render() {
    const {
      checklists,
      terminatedChecklistsCount,
      deactivatedChecklistsCount
    } = this.Checklists

    return (
      <Container>
        {checklists.map(checklist => (
          <ChecklistFolder
            key={checklist.id}
            checklist={checklist}
            deal={this.props.deal}
            isBackOffice={this.props.isBackOffice}
          />
        ))}
      </Container>
    )
  }
}

export default connect(({ deals, user }) => ({
  isBackOffice: isBackOffice(user),
  checklists: deals.checklists,
  tasks: deals.tasks
}))(ChecklistTab)

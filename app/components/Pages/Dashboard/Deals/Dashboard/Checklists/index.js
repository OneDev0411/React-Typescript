import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'

import { Container } from './styled'
import ChecklistFolder from './ChecklistFolder'
import DraftBanner from './DraftBanner'

class ChecklistTab extends React.Component {
  state = {
    showTerminatedChecklists: false,
    showDeactivatedChecklists: false
  }

  componentWillReceiveProps(nextProps) {
    this.getShowTerminatedChecklists(nextProps)
  }

  /**
   * decide to show terminated checklists or not
   * note: it should show terminated checklists when there is...
   * ...an unread notification there
   */
  getShowTerminatedChecklists = ({ deal, checklists, tasks }) => {
    if (this.state.showTerminatedChecklists) {
      return true
    }

    const showTerminatedChecklists = _.some(deal.checklists || [], chId => {
      const checklist = checklists[chId]

      if (checklist.is_terminated && this.hasNotifications(checklist, tasks)) {
        return true
      }

      return false
    })

    this.setState({ showTerminatedChecklists })
  }

  hasNotifications = (checklist, tasks) =>
    _.some(checklist.tasks || [], id => tasks[id].room.new_notifications > 0)

  toggleDisplayTerminatedChecklists = () =>
    this.setState(state => ({
      showTerminatedChecklists: !state.showTerminatedChecklists
    }))

  toggleDisplayDeactivatedChecklists = () =>
    this.setState(state => ({
      showDeactivatedChecklists: !state.showDeactivatedChecklists
    }))

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
        <DraftBanner
          deal={this.props.deal}
          checklists={this.props.checklists}
          tasks={this.props.tasks}
        />

        {checklists.map(checklist => (
          <ChecklistFolder
            key={checklist.id}
            checklist={checklist}
            deal={this.props.deal}
            isBackOffice={this.props.isBackOffice}
          />
        ))}

        <Flex>
          {terminatedChecklistsCount > 0 && (
            <ActionButton
              onClick={this.toggleDisplayTerminatedChecklists}
              appearance="outline"
              style={{
                marginRight: '0.5rem'
              }}
            >
              {this.state.showTerminatedChecklists ? 'Hide' : 'Show'} Terminated
            </ActionButton>
          )}

          {deactivatedChecklistsCount > 0 && (
            <ActionButton
              onClick={this.toggleDisplayDeactivatedChecklists}
              appearance="outline"
            >
              {this.state.showDeactivatedChecklists ? 'Hide' : 'Show'} Backed up
            </ActionButton>
          )}
        </Flex>
      </Container>
    )
  }
}

export default connect(({ deals }) => ({
  checklists: deals.checklists,
  tasks: deals.tasks
}))(ChecklistTab)

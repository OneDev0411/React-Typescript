import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { PanelGroup } from 'react-bootstrap'
import cn from 'classnames'
import Tasks from '../tasks'

class Checklist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showTerminatedChecklists: false,
      showDeactivatedChecklists: false
    }
  }

  toggleDisplayTerminatedChecklists() {
    this.setState({
      showTerminatedChecklists: !this.state.showTerminatedChecklists
    })
  }

  toggleDisplayDeactivatedChecklists() {
    this.setState({
      showDeactivatedChecklists: !this.state.showDeactivatedChecklists
    })
  }

  render() {
    let terminatedChecklistsCount = 0
    let deactivatedChecklistsCount = 0
    const { showTerminatedChecklists, showDeactivatedChecklists } = this.state
    const { deal, checklists, isBackOffice } = this.props
    const isWebkit = 'WebkitAppearance' in document.documentElement.style

    return (
      <div className="checklists-container" data-simplebar={!isWebkit || null}>
        <PanelGroup>
          {!deal.checklists && (
            <div className="loading">
              <i className="fa fa-spin fa-spinner fa-3x" />
            </div>
          )}
          {_.chain(deal.checklists)
            .sortBy(id => {
              const list = checklists[id]
              const isTerminated = list.is_terminated

              if (isTerminated) {
                terminatedChecklistsCount += 1

                return 100000
              }

              if (checklists[id].is_deactivated) {
                deactivatedChecklistsCount += 1

                return 200000
              }

              return list.order
            })
            .filter(id => {
              // dont display Backup contracts in BackOffice dashboard
              if (checklists[id].is_deactivated) {
                if (isBackOffice) {
                  return false
                }

                return showDeactivatedChecklists
              }

              return showTerminatedChecklists
                ? true
                : checklists[id].is_terminated === false
            })
            .map(id => (
              <Tasks key={id} deal={deal} checklist={checklists[id]} />
            ))
            .value()}
        </PanelGroup>

        <button
          className={cn('show-terminated-btn', {
            hide: terminatedChecklistsCount === 0
          })}
          onClick={() => this.toggleDisplayTerminatedChecklists()}
        >
          {showTerminatedChecklists ? 'Hide' : 'Show'} Terminated
        </button>

        <button
          className={cn('show-terminated-btn', {
            hide: isBackOffice || deactivatedChecklistsCount === 0
          })}
          onClick={() => this.toggleDisplayDeactivatedChecklists()}
        >
          {showDeactivatedChecklists ? 'Hide' : 'Show'} Backed up
        </button>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice,
  checklists: deals.checklists
}))(Checklist)

import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { PanelGroup } from 'react-bootstrap'
import Tasks from '../tasks'

class Checklist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showTerminatedChecklists: false
    }
  }

  toggleDisplayTerminatedChecklists() {
    this.setState({
      showTerminatedChecklists: !this.state.showTerminatedChecklists
    })
  }

  render() {
    let terminatedChecklistsCount = 0
    const { showTerminatedChecklists } = this.state
    const { deal, checklists, isBackOffice } = this.props

    return (
      <div className="checklists-container" data-simplebar>
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

              return list.order
            })
            .filter(id => {
              // dont display Backup contracts in BackOffice dashboard
              if (isBackOffice && checklists[id].is_deactivated) {
                return false
              }

              return showTerminatedChecklists
                ? true
                : checklists[id].is_terminated === false
            })
            .map(id => <Tasks key={id} deal={deal} checklist={checklists[id]} />)
            .value()}
        </PanelGroup>

        <button
          className="show-terminated-btn"
          style={{ display: terminatedChecklistsCount > 0 ? 'block' : 'none' }}
          onClick={() => this.toggleDisplayTerminatedChecklists()}
        >
          {showTerminatedChecklists ? 'Hide' : 'Show'} Terminated
        </button>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice,
  checklists: deals.checklists
}))(Checklist)

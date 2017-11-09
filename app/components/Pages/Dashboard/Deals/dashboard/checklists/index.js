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
    const { deal, checklists } = this.props

    if (!deal.checklists) {
      return false
    }

    return (
      <div className="checklists-container">
        <PanelGroup>
          {
            _
            .chain(deal.checklists)
            .sortBy(id => {
              const list = checklists[id]
              const isTerminated = list.is_terminated

              if (isTerminated) {
                terminatedChecklistsCount += 1
                return 100000
              }

              return list.order
            })
            .filter(id =>
              showTerminatedChecklists ? true : (checklists[id].is_terminated === false)
            )
            .map(id =>
              <Tasks
                key={id}
                deal={deal}
                checklist={checklists[id]}
              />
            )
            .value()
          }
        </PanelGroup>

        <button
          className="show-terminated-btn"
          style={{ display: terminatedChecklistsCount > 0 ? 'block': 'none' }}
          onClick={() => this.toggleDisplayTerminatedChecklists()}
        >
          { showTerminatedChecklists ? 'Hide' : 'Show' } Terminated
        </button>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  checklists: deals.checklists
}))(Checklist)

import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { PanelGroup } from 'react-bootstrap'
import List from './list'

class Checklist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showTerminatedChecklists: false
    }
  }

  componentDidMount() {

  }

  toggleDisplayTerminatedChecklists() {
    this.setState({
      showTerminatedChecklists: !this.state.showTerminatedChecklists
    })
  }

  render() {
    let terminatedsCount = 0
    const { showTerminatedChecklists } = this.state
    const { deal, selectedTaskId, onSelectTask, checklists } = this.props

    if (!deal.checklists) {
      return false
    }

    return (
      <div className="tasks-container">
        <PanelGroup>
          {
            _
            .chain(deal.checklists)
            .sortBy(id => {
              const list = checklists[id]
              const isTerminated = list.is_terminated

              if (isTerminated) {
                terminatedsCount += 1
                return 100000
              }

              return list.order
            })
            .filter(id => {
              if (showTerminatedChecklists) {
                return true
              } else {
                return checklists[id].is_terminated === false
              }
            })
            .map(id =>
              <List
                key={id}
                dealId={deal.id}
                section={checklists[id]}
                selectedTaskId={selectedTaskId}
                onSelectTask={onSelectTask}
              />
            )
            .value()
          }
        </PanelGroup>

        <button
          className="show-terminated-btn"
          style={{ display: terminatedsCount > 0 ? 'block': 'none' }}
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

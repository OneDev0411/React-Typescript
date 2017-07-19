import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import TasksList from './tasks'
import ControlPanel from './control-panel'
import FactSheet from './fact-sheet'

class DealDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props.deal)
  }

  render() {
    const { deal } = this.props

    return (
      <Row className="deal-dashboard">
        <Col lg={2} md={2} className="column">
          <ControlPanel deal={deal} />
        </Col>

        <Col lg={3} md={4} className="column">
          <TasksList
            tasks={deal.tasks}
          />
        </Col>

        <Col lg={2} md={3} className="column">
          <FactSheet
            deal={deal}
          />
        </Col>

        <Col lg={5} md={3} className="column">
          ---
        </Col>

      </Row>
    )
  }
}

function mapStateToProps({ deals }, props) {
  const { list } = deals
  const { id } = props.params

  return {
    deal: list && list[id] ? list[id] : null
  }
}

export default connect(mapStateToProps)(DealDetails)

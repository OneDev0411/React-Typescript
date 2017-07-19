import React from 'react'
import { connect } from 'react-redux'
import TasksList from './tasks'

class DealDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props)
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { deal } = this.props

    return (
      <div>
        <TasksList
          tasks={deal.tasks}
        />
      </div>
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

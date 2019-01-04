import React from 'react'
import { connect } from 'react-redux'
import Form from './form'
import Pages from './pages'

class Workspace extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { deal, splitter } = this.props

    return (
      <div>
        <Form deal={deal} />
        <Pages splitter={splitter} />
      </div>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    splitter: deals.splitter
  }
}

export default connect(mapStateToProps)(Workspace)

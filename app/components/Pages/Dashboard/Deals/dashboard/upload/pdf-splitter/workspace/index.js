import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { DropTarget } from 'react-dnd'
import cn from 'classnames'
import _ from 'underscore'
import Form from './form'
import Pages from './pages'

class Workspace extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { deal, splitter, upload } = this.props

    return (
      <div>
        <Form deal={deal} upload={upload} />
        <Pages upload={upload} splitter={splitter} />
      </div>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    splitter: deals.splitter,
    upload: deals.upload
  }
}

export default connect(mapStateToProps)(Workspace)

import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { DropTarget } from 'react-dnd'
import cn from 'classnames'
import _ from 'underscore'
import Page from '../page'
import Form from './form'
import PdfList from './pdf-list'

class Workspace extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { splitter, upload } = this.props

    return (
      <div>
        <Form
          upload={upload}
        />

        <PdfList
          upload={upload}
          splitter={splitter}
        />
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

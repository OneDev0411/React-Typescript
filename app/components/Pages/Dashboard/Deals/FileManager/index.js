import React from 'react'
import { connect } from 'react-redux'

import { Container } from './styled'
import { setUploadFiles } from 'actions/deals'

import Table from './Table'

export class FileManager extends React.Component {
  render() {
    return (
      <Container>
        <Table deal={this.props.deal} />
      </Container>
    )
  }
}

export default connect(
  null,
  {
    setUploadFiles
  }
)(FileManager)

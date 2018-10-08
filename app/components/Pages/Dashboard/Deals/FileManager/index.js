import React from 'react'
import { connect } from 'react-redux'

import { Container } from './styled'
import { setUploadFiles } from 'actions/deals'

import UploadPrompt from '../UploadManager/prompt'

import Table from './Table'

export class FileManager extends React.Component {
  render() {
    const { deal } = this.props

    return (
      <Container>
        <Table deal={deal} />

        <UploadPrompt deal={deal} />
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

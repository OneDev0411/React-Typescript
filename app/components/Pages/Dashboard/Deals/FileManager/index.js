import React from 'react'

import { Container } from './styled'

import Table from './Table'

class FileManager extends React.Component {
  render() {
    return (
      <Container>
        <Table deal={this.props.deal} />
      </Container>
    )
  }
}

export default FileManager

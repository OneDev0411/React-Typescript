import React from 'react'
import { connect } from 'react-redux'

import DigitalForm from './DigitalForm'
import FileAttachments from './Attachments'

import { Container } from './styled'

class TaskFiles extends React.Component {
  render() {
    const { deal, task, isBackOffice } = this.props

    return (
      <Container isOpen={this.props.isOpen}>
        <DigitalForm deal={deal} task={task} isBackOffice={isBackOffice} />

        <FileAttachments
          deal={deal}
          task={task}
          isBackOffice={isBackOffice}
          attachments={task.room.attachments || []}
        />
      </Container>
    )
  }
}

export default connect(null)(TaskFiles)

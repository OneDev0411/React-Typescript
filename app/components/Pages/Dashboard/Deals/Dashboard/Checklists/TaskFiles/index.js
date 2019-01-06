import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import DigitalForm from './DigitalForm'
import FileAttachment from './Attachment'

import { Container } from './styled'

class TaskFiles extends React.Component {
  get Files() {
    const { task } = this.props

    const attachments = task.room.attachments || []

    return _.sortBy(attachments.concat(task), item => item.updated_at * -1)
  }

  render() {
    const { deal, task, isBackOffice } = this.props

    return (
      <Container isOpen={this.props.isOpen}>
        {this.Files.map((item, key) =>
          item.type === 'task' ? (
            <DigitalForm
              key={key}
              deal={deal}
              task={item}
              isBackOffice={isBackOffice}
            />
          ) : (
            <FileAttachment
              key={key}
              deal={deal}
              task={task}
              isBackOffice={isBackOffice}
              file={item}
            />
          )
        )}
      </Container>
    )
  }
}

export default connect(null)(TaskFiles)

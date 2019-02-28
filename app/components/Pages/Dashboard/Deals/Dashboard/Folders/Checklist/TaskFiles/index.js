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

    return _.sortBy(attachments.concat(task), item => {
      const time =
        item.type === 'task' && item.submission
          ? item.submission.updated_at
          : item.updated_at

      return time * -1
    })
  }

  render() {
    const { props } = this

    if (!this.props.isOpen) {
      return false
    }

    return (
      <Container>
        {this.Files.map((item, key) =>
          item.type === 'task' ? (
            <DigitalForm
              key={key}
              task={item}
              deal={props.deal}
              isBackOffice={props.isBackOffice}
            />
          ) : (
            <FileAttachment
              key={key}
              deal={props.deal}
              task={props.task}
              file={item}
              isBackOffice={props.isBackOffice}
            />
          )
        )}
      </Container>
    )
  }
}

export default connect(null)(TaskFiles)

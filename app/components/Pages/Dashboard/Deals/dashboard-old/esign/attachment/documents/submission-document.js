import React, { Fragment } from 'react'
import _ from 'underscore'
import DocumentItem from './item-row'

export default class SubmissionDocument extends React.Component {
  isSelected = () => {
    const { esign, task } = this.props
    const { attachments } = esign

    return (
      _.findIndex(attachments, {
        type: 'form',
        task_id: task.id
      }) > -1
    )
  }

  toggle = () => {
    const { onAddAttachment, onRemoveAttachment, task } = this.props

    const attachment = {
      type: 'form',
      id: `task_${task.id}`,
      task_id: task.id,
      revision: task.submission.last_revision,
      name: `${task.title}.pdf`
    }

    return this.isSelected()
      ? onRemoveAttachment(attachment)
      : onAddAttachment(attachment)
  }

  render() {
    const { task, submission } = this.props
    const isSelected = this.isSelected()
    const isCompleted = submission.state === 'Fair'

    const description = (
      <Fragment>
        {isCompleted ? (
          <span className="text-success">Digital Form (Completed)</span>
        ) : (
          <span className="text-danger">
            Digital Form (May have incomplete fields)
          </span>
        )}
      </Fragment>
    )

    return (
      <DocumentItem
        isSelected={isSelected}
        title={task.title}
        description={description}
        date={submission.updated_at}
        onToggle={this.toggle}
      />
    )
  }
}

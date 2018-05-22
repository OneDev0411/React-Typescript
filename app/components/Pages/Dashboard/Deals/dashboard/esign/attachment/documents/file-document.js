import React from 'react'
import DocumentItem from './item-row'

export default class FileDocument extends React.Component {
  isSelected = () => {
    const { esign, file } = this.props
    const { attachments } = esign

    return (
      _.findIndex(attachments, {
        type: 'file',
        file_id: file.id
      }) > -1
    )
  }

  toggle = () => {
    const { onAddAttachment, onRemoveAttachment, file, task } = this.props

    const attachment = {
      type: 'file',
      id: `file_${file.id}`,
      task_id: task.id,
      file_id: file.id,
      name: file.name
    }

    return this.isSelected()
      ? onRemoveAttachment(attachment)
      : onAddAttachment(attachment)
  }

  render() {
    const { file } = this.props
    const isSelected = this.isSelected()

    return (
      <DocumentItem
        isSelected={isSelected}
        title={file.name}
        description="Uploaded at"
        date={file.created_at}
        onToggle={this.toggle}
      />
    )
  }
}

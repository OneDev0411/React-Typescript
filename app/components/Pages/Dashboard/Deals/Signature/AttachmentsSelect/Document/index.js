import React from 'react'
import { connect } from 'react-redux'
import fecha from 'fecha'

import { CheckBoxButton } from 'components/Button/CheckboxButton'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { moveTaskFile } from 'actions/deals'

import TasksDropDown from '../../../components/TasksDropdown'

import { Container, DocumentItem, NameSection, Title, DateTime } from './styled'

class DocumentRow extends React.Component {
  toggleSelectSubmission = () =>
    this.props.onToggleItem({
      type: 'form',
      task: this.props.task
    })

  toggleSelectFile = file =>
    this.props.onToggleItem({
      type: 'file',
      task: this.props.task,
      file
    })

  onSelectTask = async (taskId = null, notifyOffice = false) => {
    try {
      return this.props.moveTaskFile(
        this.props.user,
        this.props.deal.id,
        this.props.tasks[taskId],
        this.props.stashFile,
        notifyOffice
      )
    } catch (e) {
      console.log(e)
    }
  }

  getFormattedDate = object =>
    fecha.format(new Date(object.created_at), 'MMM DD, h:mm A')

  render() {
    const { task, stashFile } = this.props

    return (
      <Container>
        {task &&
          task.room.attachments &&
          task.room.attachments
            .filter(file => file.mime === 'application/pdf')
            .map(file => (
              <DocumentItem key={file.id}>
                <CheckBoxButton
                  onClick={() => this.toggleSelectFile(file)}
                  isSelected={this.props.selectedItems[`file_${file.id}`]}
                />
                <NameSection onClick={() => this.toggleSelectFile(file)}>
                  <Title>
                    <TextMiddleTruncate text={file.name} maxLength={60} />
                  </Title>
                  <DateTime>{this.getFormattedDate(file)}</DateTime>
                </NameSection>
              </DocumentItem>
            ))}

        {task && task.submission && (
          <DocumentItem onClick={this.toggleSelectSubmission}>
            <CheckBoxButton
              onClick={this.toggleSelectSubmission}
              isSelected={this.props.selectedItems[`task_${task.id}`]}
            />
            <NameSection>
              <Title>
                <TextMiddleTruncate text={task.title} maxLength={60} />
              </Title>
              <DateTime>{this.getFormattedDate(task)}</DateTime>
            </NameSection>
          </DocumentItem>
        )}

        {!task && stashFile && (
          <DocumentItem spaceBetween>
            <NameSection>
              <Title>
                <TextMiddleTruncate text={stashFile.name} maxLength={60} />
              </Title>
              <DateTime>{this.getFormattedDate(stashFile)}</DateTime>
            </NameSection>

            <TasksDropDown
              showStashOption={false}
              searchable
              pullRight
              showNotifyOption
              deal={this.props.deal}
              onSelectTask={this.onSelectTask}
            />
          </DocumentItem>
        )}
      </Container>
    )
  }
}

function mapStateToProps({ user, deals }) {
  return {
    user,
    tasks: deals.tasks
  }
}

export default connect(
  mapStateToProps,
  { moveTaskFile }
)(DocumentRow)

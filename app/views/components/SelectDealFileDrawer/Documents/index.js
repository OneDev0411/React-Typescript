import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import fecha from 'fecha'

import Flex from 'styled-flex-component'

import { CheckBoxButton } from 'components/Button/CheckboxButton'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import Search from 'components/Grid/Search'

import { selectDealTasks } from 'reducers/deals/tasks'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'
import { getChecklistById } from 'reducers/deals/checklists'

import { getFileUrl } from 'deals/utils/get-document-file-url'

import { moveTaskFile } from 'actions/deals'

import Tooltip from 'components/tooltip'
import LinkButton from 'components/Button/LinkButton'
import TasksDrawer from 'components/SelectDealTasksDrawer'

import { normalizeAttachment } from '../helpers/normalize-attachment'

import {
  Container,
  DocumentItem,
  NameSection,
  Title,
  DateTime,
  ChecklistName,
  ViewDocument
} from './styled'

class DocumentRow extends React.Component {
  state = {
    searchFilter: '',
    selectedStashFile: null
  }

  handleOpenMoveFileDrawer = document => {
    const file = this.props.deal.files.find(
      file => file.id === document.file_id
    )

    this.setState({
      selectedStashFile: file
    })
  }

  handleCloseMoveFileDrawer = () => {
    this.setState({
      selectedStashFile: null
    })
  }

  handleSearch = searchFilter =>
    this.setState({
      searchFilter
    })

  handleMoveComplete = (task, file) => {
    const item = normalizeAttachment({
      type: 'file',
      task,
      file
    })

    this.props.onToggleItem(item)

    this.props.notify({
      message: 'The file is moved and selected',
      status: 'success'
    })

    const element = document.getElementById(item.id)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  onSelectTask = async (taskId = null, notifyOffice = false) => {
    const task = this.props.tasks.find(task => task.id === taskId)

    try {
      return this.props.moveTaskFile(
        this.props.user,
        this.props.deal,
        task,
        this.props.stashFile,
        notifyOffice
      )
    } catch (e) {
      console.log(e)
    }
  }

  isInitialAttachment = document => {
    return (
      this.props.initialAttachments &&
      Object.values(this.props.initialAttachments).some(item => {
        const key = document.type === 'form' ? 'task_id' : 'file_id'

        return item[key] === document[key]
      })
    )
  }

  getFormattedDate = date => fecha.format(new Date(date), 'MMM DD YYYY, h:mm A')

  getStashFiles = () =>
    (this.props.deal.files || [])
      .filter(file => file.mime === 'application/pdf')
      .map(file =>
        normalizeAttachment({
          type: 'file',
          task: null,
          file
        })
      )

  getDocuments = () => {
    let attachments = []
    let submissions = []

    this.props.tasks.forEach(task => {
      if (task.submission) {
        const files = getFileUrl({
          type: 'task',
          deal: this.props.deal,
          task,
          envelopes: this.props.envelopes
        }).map(() =>
          normalizeAttachment({
            type: 'form',
            task
          })
        )

        submissions = [...submissions, ...files]
      }

      // get attachments of task
      if (Array.isArray(task.room.attachments)) {
        task.room.attachments
          .filter(file => file.mime === 'application/pdf')
          .forEach(file => {
            const docs = getFileUrl({
              type: 'document',
              deal: this.props.deal,
              task,
              document: file,
              envelopes: this.props.envelopes
            }).map(({ originalFile, url }) =>
              normalizeAttachment({
                type: 'file',
                task,
                file: {
                  ...originalFile,
                  url
                }
              })
            )

            attachments = [...attachments, ...docs]
          })
      }
    })

    // get stash files
    const stashFiles = this.props.showStashFiles ? this.getStashFiles() : []

    const sortedList = []
      .concat(attachments, submissions)
      .filter(item => this.isInitialAttachment(item) === false)
      .sort((a, b) => b.date - a.date)

    return Object.values(this.props.initialAttachments)
      .concat(sortedList, stashFiles)
      .filter(document =>
        document.title
          .toLowerCase()
          .includes(this.state.searchFilter.toLowerCase())
      )
  }

  render() {
    return (
      <Container>
        <Search
          style={{ margin: '1rem 0' }}
          disableOnSearch={false}
          showLoadingOnSearch
          placeholder="Search"
          onChange={this.handleSearch}
          onClearSearch={this.handleSearch}
        />

        {this.getDocuments().map((document, index) => {
          const checklist = getChecklistById(
            this.props.checklists,
            document.checklist
          )

          return (
            <DocumentItem key={index} id={document.id}>
              <Flex alignCenter>
                <Tooltip
                  caption={
                    !checklist &&
                    'You have to move this document to a checklist first'
                  }
                >
                  <CheckBoxButton
                    isDisabled={!checklist}
                    onClick={() => this.props.onToggleItem(document)}
                    isSelected={
                      Array.isArray(this.props.selectedItems) &&
                      this.props.selectedItems.some(
                        row => row.id === document.id
                      )
                    }
                  />
                </Tooltip>

                <NameSection onClick={() => this.props.onToggleItem(document)}>
                  <Title isSelectable={!!checklist}>
                    <TextMiddleTruncate text={document.title} maxLength={45} />
                  </Title>

                  <ChecklistName error={!checklist}>
                    {checklist ? checklist.title : 'No Checklist'}
                  </ChecklistName>

                  <DateTime>
                    Uploaded at {this.getFormattedDate(document.date)}
                  </DateTime>
                </NameSection>
              </Flex>

              <ViewDocument>
                {checklist && (
                  <LinkButton target="_blank" to={document.url}>
                    View
                  </LinkButton>
                )}
              </ViewDocument>

              {!checklist && (
                <LinkButton
                  onClick={() => this.handleOpenMoveFileDrawer(document)}
                >
                  Move To Checklist
                </LinkButton>
              )}
            </DocumentItem>
          )
        })}

        {this.state.selectedStashFile && (
          <TasksDrawer
            isOpen
            drawerOptions={{
              showBackdrop: false
            }}
            deal={this.props.deal}
            file={this.state.selectedStashFile}
            onClose={this.handleCloseMoveFileDrawer}
            onMoveComplete={this.handleMoveComplete}
            title="Move to Checklist"
          />
        )}
      </Container>
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  return {
    user,
    checklists: deals.checklists,
    tasks: selectDealTasks(props.deal, deals.checklists, deals.tasks),
    envelopes: selectDealEnvelopes(props.deal, deals.envelopes)
  }
}

export default connect(
  mapStateToProps,
  { moveTaskFile, notify }
)(DocumentRow)

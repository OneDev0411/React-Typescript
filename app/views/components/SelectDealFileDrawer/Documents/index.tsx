import React from 'react'
import { connect } from 'react-redux'
import { addNotification } from 'reapop'

import fecha from 'fecha'

import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

import { CheckBoxButton } from 'components/Button/CheckboxButton'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import Search from 'components/Grid/Search'

import { selectDealTasks } from 'reducers/deals/tasks'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'
import { getChecklistById } from 'reducers/deals/checklists'

import Tooltip from 'components/tooltip'

import TasksDrawer from 'components/SelectDealTasksDrawer'

import {
  ChecklistName,
  Container,
  DateTime,
  DocumentItem,
  NameSection,
  Title,
  ViewDocument
} from './styled'
import { getAllDealDocuments } from '../helpers/get-all-deal-documents'

interface Props {
  deal: IDeal
  showStashFiles: boolean
  initialAttachments: IDealFile[]
  allowNoChecklist: boolean
  selectedItems: IDealFile[]
  onToggleItem(file: IDealFile): void
}

interface State {
  searchFilter: string
  selectedStashFile: IDealFile | null | undefined
}

interface StateProps {
  user: IUser
  checklists: IDealChecklist[]
  tasks: IDealTask[]
  envelopes: IDealEnvelope[]
  addNotification: typeof addNotification
}

export class DocumentRow extends React.Component<Props & StateProps, State> {
  state: State = {
    searchFilter: '',
    selectedStashFile: null
  }

  handleOpenMoveFileDrawer = (document: IDealFile) => {
    const file = (this.props.deal.files || []).find(
      file => file.id === document.id
    )

    this.setState({
      selectedStashFile: file as IDealFile
    })
  }

  handleCloseMoveFileDrawer = () => {
    this.setState({
      selectedStashFile: null
    })
  }

  handleSearch = (searchFilter: string) => {
    this.setState({
      searchFilter
    })
  }

  handleMoveComplete = (task: IDealTask, file: IDealFile) => {
    this.props.onToggleItem(file)

    this.props.addNotification({
      message: 'The file is moved and selected',
      status: 'success'
    })

    const element = document.getElementById(file.id)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  isInitialAttachment = (document: IDealFile) => {
    return (
      this.props.initialAttachments &&
      Object.values(this.props.initialAttachments).some(item => {
        return item.id === document.id
      })
    )
  }

  getFormattedDate = (date: number) =>
    fecha.format(new Date(date * 1000), 'MMM DD YYYY, h:mm A')

  getDocuments = () => {
    const files = getAllDealDocuments(
      this.props.deal,
      this.props.envelopes,
      this.props.tasks,
      this.props.showStashFiles
    )

    // get stash files
    const stashFiles = files.filter(files => !files.task)

    const sortedList = files
      .filter(item => this.isInitialAttachment(item) === false && item.task)
      .sort((a, b) => b.created_at - a.created_at)

    return Object.values(this.props.initialAttachments)
      .concat(sortedList, stashFiles)
      .filter(file =>
        file.name.toLowerCase().includes(this.state.searchFilter.toLowerCase())
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
          const noChecklistError = !checklist && !this.props.allowNoChecklist

          return (
            <DocumentItem key={index} id={document.id}>
              <Flex alignCenter>
                <Tooltip
                  caption={
                    noChecklistError &&
                    'You have to move this document to a checklist first'
                  }
                >
                  <CheckBoxButton
                    isDisabled={noChecklistError}
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
                  <Title selectable={!noChecklistError}>
                    <TextMiddleTruncate text={document.name} maxLength={45} />
                  </Title>

                  <ChecklistName error={noChecklistError}>
                    {checklist ? checklist.title : 'No Checklist'}
                  </ChecklistName>

                  <DateTime>
                    Uploaded at {this.getFormattedDate(document.created_at)}
                  </DateTime>
                </NameSection>
              </Flex>

              <ViewDocument>
                {checklist && (
                  <Button color="secondary" target="_blank" href={document.url}>
                    View
                  </Button>
                )}
              </ViewDocument>

              {!checklist && (
                <Button
                  color="secondary"
                  onClick={() => this.handleOpenMoveFileDrawer(document)}
                >
                  Move To Checklist
                </Button>
              )}
            </DocumentItem>
          )
        })}

        {this.state.selectedStashFile && (
          <TasksDrawer
            isOpen
            drawerOptions={{
              hideBackdrop: true
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

function mapStateToProps({ deals, user }, props: Props) {
  return {
    user,
    checklists: deals.checklists,
    tasks: selectDealTasks(props.deal, deals.checklists, deals.tasks),
    envelopes: selectDealEnvelopes(props.deal, deals.envelopes)
  }
}

export default connect(
  mapStateToProps,
  () => ({ addNotification })
)(DocumentRow)

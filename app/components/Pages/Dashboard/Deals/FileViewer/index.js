import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { browserHistory } from 'react-router'

import { getDeal } from 'actions/deals'

import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'

import { isBackOffice } from 'utils/user-teams'
import { getFileType } from 'utils/file-utils/get-file-type'

import LoadingContainer from 'components/LoadingContainer'

import { getEnvelopeFile } from 'views/utils/deal-files/get-envelope-file'

import { getFileById } from '../utils/files/get-file-by-id'

import TaskView from '../Dashboard/TaskView'

import { Menu } from './Menu'
import { FactsheetSideMenu } from './FactsheetSideMenu'
import { EnvelopeSideMenu } from './EnvelopeSideMenu'
import { FileDisplay } from './FileDisplay'

import { LayoutContainer, PageContainer } from './styled'
import LoadDeal from '../components/LoadDeal'

class FileViewer extends React.Component {
  state = {
    isFactsheetOpen: false,
    isCommentsOpen: false
  }

  toggleShowFactsheet = () =>
    this.setState(state => ({
      isFactsheetOpen: !state.isFactsheetOpen
    }))

  toggleShowComments = () =>
    this.setState(state => ({
      isCommentsOpen: !state.isCommentsOpen
    }))

  getFile() {
    switch (this.EntityType) {
      case 'attachment':
        return this.AttachmentFile

      case 'envelope':
        return this.EnvelopeFile

      default:
        return this.DigitalForm
    }
  }

  get AttachmentFile() {
    const file = getFileById(this.props.params.entityId, {
      deal: this.props.deal,
      tasks: this.props.tasks,
      checklists: this.props.checklists
    })

    if (!file) {
      return {}
    }

    return {
      id: file.id,
      type: getFileType(file),
      name: file.name,
      url: file.url
    }
  }

  getEnvelope() {
    return this.EntityType === 'envelope'
      ? this.props.envelopes[this.props.params.entityId]
      : null
  }

  get EnvelopeFile() {
    const envelope = this.getEnvelope()

    if (!this.props.task || !envelope.documents) {
      return null
    }

    const file = getEnvelopeFile(envelope, this.props.task)

    if (!file) {
      this.props.notify({
        title: 'File not found',
        status: 'error'
      })

      return false
    }

    return {
      id: file.id,
      name: envelope.title,
      type: 'pdf',
      url: file.url
    }
  }

  get DigitalForm() {
    return {
      type: 'pdf',
      id: this.props.task.id,
      name: this.props.task.title,
      url: this.props.task.pdf_url
    }
  }

  get EntityType() {
    return this.props.params.entityType || 'digital-form'
  }

  handleBackButton = () => browserHistory.goBack()

  normalizeName = name => {
    try {
      return decodeURIComponent(name).replace(/[_-]/g, ' ')
    } catch (e) {
      return name
    }
  }

  render() {
    const { state, props } = this

    return (
      <LoadDeal id={props.params.id} deal={props.deal}>
        {({ isFetchingCompleted }) => {
          if (!isFetchingCompleted) {
            return (
              <LoadingContainer
                style={{
                  height: 'calc(100vh - 6em)'
                }}
              />
            )
          }

          const file = this.getFile()
          const isEnvelopeView = this.EntityType === 'envelope'

          return (
            <LayoutContainer>
              <Menu
                title={this.normalizeName(file.name)}
                file={file}
                task={props.task}
                deal={props.deal}
                isEnvelopeView={isEnvelopeView}
                isFactsheetOpen={state.isFactsheetOpen}
                isCommentsOpen={state.isCommentsOpen}
                onToggleFactsheet={this.toggleShowFactsheet}
                onToggleComments={this.toggleShowComments}
                onClickBackButton={this.handleBackButton}
              />

              <PageContainer className="u-scrollbar--thinner">
                <FactsheetSideMenu
                  isFactsheetOpen={state.isFactsheetOpen}
                  deal={props.deal}
                  isBackOffice={this.props.isBackOffice}
                />

                <FileDisplay file={file} />

                {isEnvelopeView && !state.isFactsheetOpen && (
                  <EnvelopeSideMenu
                    deal={props.deal}
                    file={file}
                    envelope={this.getEnvelope()}
                  />
                )}
              </PageContainer>

              <TaskView
                deal={props.deal}
                task={this.props.task}
                isOpen={state.isCommentsOpen}
                isBackOffice={props.isBackOffice}
                onClose={this.toggleShowComments}
              />
            </LayoutContainer>
          )
        }}
      </LoadDeal>
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  return {
    deal: selectDealById(deals.list, props.params.id),
    tasks: deals.tasks,
    checklists: deals.checklists,
    envelopes: deals.envelopes,
    task: selectTaskById(deals.tasks, props.params.taskId),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps, { notify, getDeal })(FileViewer)

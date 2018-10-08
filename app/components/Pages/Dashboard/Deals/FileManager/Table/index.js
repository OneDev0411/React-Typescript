import React, { Fragment } from 'react'
import Table from 'views/components/Grid/Table'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Dropdown } from 'react-bootstrap'
import _ from 'underscore'

import { getEnvelopeStatus } from '../../utils/get-envelop-status'
import { confirmation } from 'actions/confirmation'
import {
  getDeal,
  displaySplitter,
  syncDeleteFile,
  moveTaskFile
} from 'actions/deals'

import ActionButton from 'components/Button/ActionButton'

import Spinner from 'components/Spinner'
import VerticalDotsIcon from 'components/SvgIcons/VeriticalDots/VerticalDotsIcon'
import { grey, primary } from 'views/utils/colors'

import { SearchFiles } from '../Search'
import TasksDropDown from '../../components/TasksDropdown'
import FileName from '../columns/Name'

import { TruncatedColumn, OptionButton } from './styled'

import UploadManager from '../../UploadManager'

export class FileManager extends React.Component {
  state = {
    filter: '',
    isDeleting: [],
    updatingFiles: {},
    selectedRows: []
  }

  applyFilter = (file, task) => {
    const { filter } = this.state

    if (filter.length === 0) {
      return true
    }

    return (
      file.name.toLowerCase().includes(filter.toLowerCase()) ||
      (task && task.title.toLowerCase().includes(filter.toLowerCase()))
    )
  }

  isPdfDocument = mime => mime === 'application/pdf'

  getTdProps = (rowIndex, { rowData: file }) => ({
    onClick: () => {
      this.openFile(file)
    }
  })

  getAllFiles = () => {
    const { deal, checklists, tasks, envelopes } = this.props

    let files = []
    const stashFiles = deal.files || []

    stashFiles.filter(file => this.applyFilter(file, null)).forEach(file => {
      files.push({
        ...file,
        taskId: null,
        task: 'Draft'
      })
    })

    deal.checklists.forEach(chId => {
      const checklist = checklists[chId] || []

      if (!checklist.tasks || checklist.is_terminated) {
        return []
      }

      checklist.tasks.forEach(tId => {
        const task = tasks[tId]
        const attachments = task.room.attachments || []

        attachments
          .filter(file => this.applyFilter(file, task))
          .forEach(file => {
            files.push({
              ...file,
              taskId: task.id,
              task: task.title
            })
          })
      })
    })

    let envelopesFiles = []

    deal.envelopes &&
      deal.envelopes.forEach(envelopeId => {
        const envelope = envelopes[envelopeId]

        const envelopeFiles = envelope.documents.map(doc => {
          let file

          if (doc.file) {
            file = files.find(({ id }) => id === doc.file)
          } else if (doc.submission) {
            let submissionFile

            deal.checklists.some(checklistId => {
              const { tasks: checklistTasks } = checklists[checklistId]

              const taskId = checklistTasks.find(taskId => {
                const { submission } = tasks[taskId]

                return submission && submission.id === doc.submission
              })

              if (taskId) {
                submissionFile = {
                  ...tasks[taskId].submission.file,
                  name: decodeURI(tasks[taskId].submission.file.name),
                  taskId,
                  task: tasks[taskId].title
                }

                return true
              }
            })

            file = submissionFile
          }

          return { ...file, envelope, id: envelope.id }
        })

        envelopesFiles = envelopesFiles.concat(envelopeFiles)
      })

    return files.concat(envelopesFiles)
  }

  splitMultipleFiles = () => {
    const { selectedRows } = this.state

    const files = _.chain(this.data)
      .filter(
        file => selectedRows.includes(file.id) && this.isPdfDocument(file.mime)
      )
      .map(file => ({
        id: file.id,
        file: { url: file.url },
        properties: { name: file.name }
      }))
      .value()

    if (files.length > 0) {
      this.props.displaySplitter(files)
    }
  }

  splitSingleFile = file => {
    const files = [
      {
        id: file.id,
        file: { url: file.url },
        properties: { name: file.name }
      }
    ]

    this.props.displaySplitter(files)
  }

  requestDeleteSelectedFiles = () => {
    const { tasks, confirmation } = this.props
    const { selectedRows } = this.state
    const deleteList = {}

    _.each(selectedRows, fileId => {
      const file = this.data.find(({ id }) => id === fileId)

      deleteList[fileId] = tasks[file.taskId]
    })

    confirmation({
      message: `Delete ${selectedRows.length} files?`,
      confirmLabel: 'Yes, Delete',
      onConfirm: () => this.deleteFiles(deleteList)
    })
  }

  deleteSingleFile = file => {
    const { tasks } = this.props

    this.deleteFiles({
      [file.id]: tasks[file.taskId]
    })
  }

  deleteFiles = async files => {
    const { deal, syncDeleteFile } = this.props
    const { isDeleting } = this.state

    this.setState({
      isDeleting: [...isDeleting, ..._.keys(files)]
    })

    await syncDeleteFile(deal.id, files)

    // todo
    // this.resetSelectedRows()

    this.setState({
      selectedRows: [],
      isDeleting: _.filter(isDeleting, id => files[id] !== null)
    })
  }

  openFile = file => browserHistory.push(this.getFileLink(file))

  getFileLink = file => {
    const { deal } = this.props
    const taskId = file.taskId || 'stash'
    const type = file.envelope ? 'envelope' : 'attachment'
    const id = file.envelope ? file.envelope.id : file.id

    return `/dashboard/deals/${
      deal.id
    }/form-viewer/${taskId}/${type}/${id}?backTo=files`
  }

  onSelectTask = async (file, taskId = null, notifyOffice = false) => {
    const { user, tasks, moveTaskFile, deal } = this.props
    const { updatingFiles } = this.state
    const task = taskId ? tasks[taskId] : null

    if (file.taskId === taskId) {
      return false
    }

    this.setState({
      updatingFiles: {
        ...updatingFiles,
        [file.id]: {
          id: file.id,
          taskId
        }
      }
    })

    await moveTaskFile(user, deal.id, task, file, notifyOffice)

    this.setState({
      updatingFiles: _.omit(updatingFiles, ({ id }) => id === file.id)
    })
  }

  onChangeSelectedRows = selectedRows =>
    this.setState({
      selectedRows
    })

  getTrProps = () => ({
    hoverStyle: `
    background-color: ${grey.A000};
     a {
      color: ${primary}
    }
      #splitter-button{
          display: block !important;
      }
        `
  })

  get Columns() {
    const { isDeleting, updatingFiles } = this.state
    const { deal, tasks } = this.props

    return [
      {
        header: 'Name',
        id: 'name',
        accessor: file => file.name,
        render: ({ rowData: file }) => (
          <FileName file={file} getFileLink={file => this.getFileLink(file)} />
        )
      },
      {
        id: 'e_signature',
        header: 'eSigned By',
        accessor: 'e_signature',
        render: ({ rowData: file }) => {
          const envelope = file.envelope

          if (envelope) {
            return (
              <TruncatedColumn>{getEnvelopeStatus(envelope)}</TruncatedColumn>
            )
          }

          return null
        }
      },
      {
        id: 'envelope_name',
        header: 'Envelope Name',
        accessor: 'envelope_name',
        render: ({ rowData: file }) => {
          const envelope = file.envelope

          if (envelope) {
            return <TruncatedColumn>{envelope.title}</TruncatedColumn>
          }

          return null
        }
      },
      {
        header: 'Folder',
        accessor: 'task',
        className: 'file-table__task',
        render: ({ rowData: file }) => {
          if (file.envelope) {
            return <TruncatedColumn>{file.task}</TruncatedColumn>
          }

          return (
            <Fragment>
              <TasksDropDown
                showStashOption={file.taskId !== null}
                searchable
                showNotifyOption
                deal={deal}
                onSelectTask={(taskId, notifyOffice) =>
                  this.onSelectTask(file, taskId, notifyOffice)
                }
                selectedTask={
                  updatingFiles[file.id]
                    ? tasks[updatingFiles[file.id].taskId]
                    : tasks[file.taskId]
                }
                stashOptionText="Move it to my Files"
              />

              {updatingFiles[file.id] && (
                <i
                  className="fa fa-spinner fa-spin"
                  style={{ marginLeft: '16px' }}
                />
              )}
            </Fragment>
          )
        }
      },
      {
        id: 'td-split',
        header: '',
        accessor: '',
        width: '110px',
        render: ({ rowData: file }) => (
          <Fragment>
            {!file.envelope &&
              this.isPdfDocument(file.mime) && (
                <ActionButton
                  id="splitter-button"
                  style={{ display: 'none' }}
                  onClick={() => this.splitSingleFile(file)}
                >
                  Split PDF
                </ActionButton>
              )}
          </Fragment>
        )
      },
      {
        id: 'td-delete',
        header: '',
        accessor: '',
        className: 'td--dropdown-container',
        width: '48px',
        render: ({ rowData: file }) => (
          <Dropdown
            id={`file_${file.id}`}
            className="deal-file-cta-menu"
            pullRight
          >
            <OptionButton
              appearance="icon"
              onClick={e => e.stopPropagation()}
              // className="cta-btn btn-link"
              bsRole="toggle"
            >
              <VerticalDotsIcon />
            </OptionButton>

            <Dropdown.Menu>
              <li>
                {isDeleting.includes(file.id) ? (
                  <span>
                    <Spinner /> Deleting ...
                  </span>
                ) : (
                  <span onClick={() => this.deleteSingleFile(file)}>
                    Delete file
                  </span>
                )}
              </li>
            </Dropdown.Menu>
          </Dropdown>
        )
      }
    ]
  }

  actions = [
    {
      display: ({ selectedRows }) => selectedRows.length > 0,
      render: () => (
        <ActionButton
          appearance="outline"
          disabled={this.state.isDeleting.length > 0}
          onClick={this.requestDeleteSelectedFiles}
        >
          {this.state.isDeleting.length === 0
            ? 'Delete files'
            : `Deleting ${this.state.isDeleting.length} files`}
        </ActionButton>
      )
    },
    {
      display: ({ selectedRows }) =>
        selectedRows.some(fileId => {
          const file = this.data.find(({ id }) => id === fileId)

          return file && this.isPdfDocument(file.mime)
        }),
      render: () => (
        <ActionButton appearance="outline" onClick={this.splitMultipleFiles}>
          Split PDFs
        </ActionButton>
      )
    }
  ]

  render() {
    const { filter, selectedRows } = this.state
    const { deal } = this.props

    this.data = this.getAllFiles()

    // if (this.data.length === 0 && filter.length === 0) {
    //   return (
    //     <UploadManager disableClick deal={deal}>
    //       <div className="empty-table">
    //         <img src="/static/images/deals/files.svg" alt="" />
    //         No uploaded files in this deal
    //       </div>
    //     </UploadManager>
    //   )
    // }

    return (
      <Fragment>
        <SearchFiles
          onSearch={filter => this.setState({ selectedRows: [], filter })}
        />

        {this.data.length === 0 && filter.length !== 0 ? (
          <div className="empty-table" style={{ marginTop: '10vh' }}>
            <img src="/static/images/deals/files.svg" alt="" />
            No uploaded file found.
          </div>
        ) : (
          <UploadManager disableClick deal={deal}>
            <Table
              plugins={{
                sortable: {},
                selectable: {
                  persistent: false,
                  storageKey: 'dealFiles',
                  onChange: this.onChangeSelectedRows
                },
                actionable: {
                  actions: this.actions
                }
              }}
              data={this.data}
              summary={{
                entityName: 'Files'
              }}
              columns={this.Columns}
              getTdProps={this.getTdProps}
              getTrProps={this.getTrProps}
            />
          </UploadManager>
        )}
      </Fragment>
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    checklists: deals.checklists,
    tasks: deals.tasks,
    envelopes: deals.envelopes,
    user
  }),
  {
    confirmation,
    getDeal,
    syncDeleteFile,
    displaySplitter,
    moveTaskFile
  }
)(FileManager)

import React, { Fragment } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import cn from 'classnames'
import { browserHistory, Link } from 'react-router'
import { Dropdown, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import styled from 'styled-components'
import {
  getDeal,
  displaySplitter,
  syncDeleteFile,
  moveTaskFile
} from '../../../../../store_actions/deals'
import { confirmation } from '../../../../../store_actions/confirmation'
import Radio from '../../../../../views/components/radio'
import VerticalDotsIcon from '../../Partials/Svgs/VerticalDots'
import Search from '../../../../Partials/headerSearch'
import Upload from '../dashboard/upload'
import TasksDropDown from '../components/tasks-dropdown'
import { getESignature } from '../utils/get-eSignature'

const EllipsisColumn = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`
export class FileManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      isDeleting: [],
      updatingFiles: {},
      selectedRows: {}
    }

    this.onCellClick = this.onCellClick.bind(this)
  }

  getDate(date) {
    return moment.unix(date).format('MMMM DD, YY [at] hh:mm A')
  }

  applyFilter(file, task) {
    const { filter } = this.state

    if (filter.length === 0) {
      return true
    }

    return (
      file.name.toLowerCase().includes(filter.toLowerCase()) ||
      (task && task.title.toLowerCase().includes(filter.toLowerCase()))
    )
  }

  isPdfDocument(mime) {
    return mime === 'application/pdf'
  }

  onCellClick(state, rowInfo, column) {
    return {
      onClick: (e, handleOriginal) => {
        if (
          ['td-select', 'td-delete', 'td-split'].includes(column.id) === false
        ) {
          return this.openFile(rowInfo.original)
        }

        if (column.id === 'td-select') {
          this.toggleSelectedRow(rowInfo.original)
        }

        if (handleOriginal) {
          handleOriginal()
        }
      }
    }
  }

  getAllFiles() {
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

          return { ...file, envelope }
        })

        envelopesFiles = envelopesFiles.concat(envelopeFiles)
      })

    return files.concat(envelopesFiles)
  }

  getCellTitle(title) {
    return (
      <Fragment>
        {title}
        <i className="fa fa-caret-down" />
        <i className="fa fa-caret-up" />
      </Fragment>
    )
  }

  getDocumentIcon(file) {
    let src

    if (this.isPdfDocument(file.mime)) {
      src = '/static/images/deals/pdf-icon.svg'
    } else if (file.mime.includes('image/')) {
      src = file.preview_url
    }

    return <img className="icon" src={src} alt="" />
  }

  toggleSelectedRow(file) {
    const { selectedRows } = this.state
    let newSelectedRows = []

    if (selectedRows[file.id]) {
      newSelectedRows = _.omit(selectedRows, row => row.id === file.id)
    } else {
      newSelectedRows = {
        ...selectedRows,
        [file.id]: file
      }
    }

    this.setState({ selectedRows: newSelectedRows })
  }

  toggleSelectAll(rows) {
    const { selectedRows } = this.state
    const shouldSelectAll = _.size(selectedRows) < rows.length

    this.setState({
      selectedRows: shouldSelectAll ? _.indexBy(rows, 'id') : {}
    })
  }

  splitMultipleFiles() {
    const { selectedRows } = this.state

    const files = _.chain(selectedRows)
      .filter(file => this.isPdfDocument(file.mime))
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

  splitSingleFile(file) {
    const files = [
      {
        id: file.id,
        file: { url: file.url },
        properties: { name: file.name }
      }
    ]

    this.props.displaySplitter(files)
  }

  requestDeleteSelectedFiles() {
    const { tasks, confirmation } = this.props
    const { selectedRows } = this.state
    const deleteList = {}

    _.each(selectedRows, file => {
      deleteList[file.id] = tasks[file.taskId]
    })

    confirmation({
      message: `Delete ${_.size(selectedRows)} files?`,
      confirmLabel: 'Yes, Delete',
      onConfirm: () => this.deleteFiles(deleteList)
    })
  }

  deleteSingleFile(file) {
    const { tasks } = this.props

    this.deleteFiles({
      [file.id]: tasks[file.taskId]
    })
  }

  async deleteFiles(files) {
    const { deal, syncDeleteFile } = this.props
    const { isDeleting } = this.state

    this.setState({
      isDeleting: [...isDeleting, ..._.keys(files)]
    })

    await syncDeleteFile(deal.id, files)

    this.setState({
      selectedRows: [],
      isDeleting: _.filter(isDeleting, id => files[id] !== null)
    })
  }

  openFile(file) {
    browserHistory.push(this.getFileLink(file))
  }

  getFileLink(file) {
    const { deal } = this.props
    const taskId = file.taskId || 'stash'
    const type = file.envelope ? 'envelope' : 'attachment'
    const id = file.envelope ? file.envelope.id : file.id

    return `/dashboard/deals/${
      deal.id
    }/form-viewer/${taskId}/${type}/${id}?backTo=files`
  }

  async onSelectTask(file, taskId = null, notifyOffice = false) {
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

  getColumns(rows) {
    const { selectedRows, isDeleting, updatingFiles } = this.state
    const { deal, tasks } = this.props

    return [
      {
        id: 'td-select',
        headerClassName: 'select-row-header',
        Header: () => (
          <Radio
            square
            selected={rows.length > 0 && rows.length === _.size(selectedRows)}
            onClick={() => this.toggleSelectAll(rows)}
          />
        ),
        accessor: '',
        width: 40,
        className: 'select-row',
        sortable: false,
        Cell: ({ original: file }) => (
          <Radio square selected={selectedRows[file.id]} />
        )
      },
      {
        id: 'name',
        Header: () => this.getCellTitle('NAME'),
        className: 'name',
        accessor: 'name',
        Cell: ({ original: file }) => (
          <Fragment>
            <Link to={this.getFileLink(file)}>
              {this.getDocumentIcon(file)}
              {file.name}
            </Link>
          </Fragment>
        )
      },
      {
        id: 'created_at',
        Header: () => this.getCellTitle('DATE UPLOADED'),
        accessor: 'created_at',
        Cell: ({ value }) => this.getDate(value)
      },
      {
        id: 'e_signature',
        Header: () => this.getCellTitle('eSignature'),
        accessor: 'e_signature',
        Cell: ({ original: file }) => {
          const envelope = file.envelope

          if (envelope) {
            return <EllipsisColumn>{getESignature(envelope)}</EllipsisColumn>
          }

          return null
        }
      },
      {
        id: 'envelope_name',
        Header: () => this.getCellTitle('ENVELOPE NAME'),
        accessor: 'envelope_name',
        Cell: ({ original: file }) => {
          const envelope = file.envelope

          if (envelope) {
            return <EllipsisColumn>{envelope.title}</EllipsisColumn>
          }

          return null
        }
      },
      {
        Header: () => this.getCellTitle('FOLDER'),
        accessor: 'task',
        className: 'file-table__task',
        Cell: ({ original: file }) => {
          if (file.envelope) {
            return <EllipsisColumn>{file.task}</EllipsisColumn>
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
        Header: '',
        accessor: '',
        width: 110,
        Cell: ({ original: file }) => (
          <Fragment>
            {!file.envelope &&
              this.isPdfDocument(file.mime) && (
                <button
                  className="button split-button hide"
                  onClick={() => this.splitSingleFile(file)}
                >
                  Split PDF
                </button>
              )}
          </Fragment>
        )
      },
      {
        id: 'td-delete',
        Header: '',
        accessor: '',
        className: 'td--dropdown-container',
        width: 30,
        Cell: ({ original: file }) => (
          <Dropdown
            id={`file_${file.id}`}
            className="deal-file-cta-menu"
            pullRight
          >
            <Button
              onClick={e => e.stopPropagation()}
              className="cta-btn btn-link"
              bsRole="toggle"
            >
              <VerticalDotsIcon fill="#D7DEE2" />
            </Button>

            <Dropdown.Menu>
              <li>
                {isDeleting.includes(file.id) ? (
                  <span>
                    <i className="fa fa-spinner fa-spin" /> Deleting ...
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

  render() {
    const { filter, isDeleting, selectedRows } = this.state
    const { deal } = this.props
    const data = this.getAllFiles()

    if (data.length === 0 && filter.length === 0) {
      return (
        <Upload disableClick deal={deal}>
          <div className="empty-table">
            <img src="/static/images/deals/files.svg" alt="" />
            No uploaded files in this deal
          </div>
        </Upload>
      )
    }

    return (
      <Fragment>
        <Search
          onInputChange={filter => this.setState({ filter })}
          debounceTime={100}
          placeholder="Search all uploaded files in this deal…"
        />

        <div className="callToActions">
          {_.size(selectedRows) > 0 && (
            <button
              className={cn('button inverse', {
                disabled: isDeleting.length > 0
              })}
              disabled={isDeleting.length > 0}
              onClick={() => this.requestDeleteSelectedFiles()}
            >
              {isDeleting.length === 0
                ? 'Delete files'
                : `Deleting ${isDeleting.length} files`}
            </button>
          )}

          {_.some(selectedRows, file => this.isPdfDocument(file.mime)) && (
            <button
              className="button"
              onClick={() => this.splitMultipleFiles()}
            >
              Split PDFs
            </button>
          )}
        </div>

        {data.length === 0 && filter.length !== 0 ? (
          <div className="empty-table" style={{ marginTop: '10vh' }}>
            <img src="/static/images/deals/files.svg" alt="" />
            No uploaded file found.
          </div>
        ) : (
          <Upload disableClick deal={deal}>
            <ReactTable
              showPagination={false}
              data={data}
              pageSize={data.length}
              columns={this.getColumns(data)}
              getTdProps={this.onCellClick}
              defaultSorted={[
                {
                  id: 'created_at',
                  desc: true
                }
              ]}
              sortable
              resizable
            />
          </Upload>
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

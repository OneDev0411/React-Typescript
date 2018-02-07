import React, { Fragment } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import cn from 'classnames'
import { browserHistory } from 'react-router'
import { Dropdown, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import {
  getDeal,
  displaySplitter,
  deleteAttachment
} from '../../../../../store_actions/deals'
import { confirmation } from '../../../../../store_actions/confirmation'
import Radio from '../components/radio'
import VerticalDotsIcon from '../../Partials/Svgs/VerticalDots'
import Search from '../../../../Partials/headerSearch'

export class FileManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      isDeleting: [],
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
      task.title.toLowerCase().includes(filter.toLowerCase())
    )
  }

  isPdfDocument(mime) {
    return mime === 'application/pdf'
  }

  onCellClick(state, rowInfo, column) {
    return {
      onClick: (e, handleOriginal) => {
        if (['radio', 'delete'].indexOf(column.id) === -1) {
          return this.openFile(rowInfo.original)
        }

        if (column.id === 'radio') {
          this.toggleSelectedRow(rowInfo.original)
        }

        if (handleOriginal) {
          handleOriginal()
        }
      }
    }
  }

  getAllFiles() {
    const { deal, checklists, tasks } = this.props
    const files = []

    deal.checklists.forEach(chId => {
      const checklist = checklists[chId] || []

      checklist.tasks.forEach(tId => {
        const task = tasks[tId]
        const attachments = task.room.attachments || []

        attachments.filter(file => this.applyFilter(file, task)).forEach(file => {
          files.push({
            ...file,
            taskId: task.id,
            task: task.title
          })
        })
      })
    })

    return files
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
    const { deal, deleteAttachment } = this.props
    const { isDeleting } = this.state

    this.setState({
      isDeleting: [...isDeleting, ..._.keys(files)]
    })

    await deleteAttachment(deal.id, files)

    this.setState({
      selectedRows: [],
      isDeleting: _.filter(isDeleting, id => files[id] !== null)
    })
  }

  openFile(file) {
    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}/form-viewer/${file.taskId}/attachment/${
      file.id
    }?backTo=files`)
  }

  getColumns(rows) {
    const { selectedRows, isDeleting } = this.state

    return [
      {
        id: 'radio',
        Header: () => (
          <Radio
            selected={rows.length > 0 && rows.length === _.size(selectedRows)}
            onClick={() => this.toggleSelectAll(rows)}
          />
        ),
        accessor: '',
        width: 40,
        className: 'select-row',
        sortable: false,
        Cell: ({ original: file }) => <Radio selected={selectedRows[file.id]} />
      },
      {
        id: 'name',
        Header: () => this.getCellTitle('NAME'),
        className: 'name',
        accessor: 'name',
        Cell: ({ original: file }) => (
          <Fragment>
            {this.getDocumentIcon(file)}
            {file.name}
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
        Header: () => this.getCellTitle('TASK'),
        accessor: 'task'
      },
      {
        Header: '',
        accessor: '',
        width: 110,
        Cell: ({ original: file }) => (
          <Fragment>
            {this.isPdfDocument(file.mime) && (
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
        id: 'delete',
        Header: '',
        accessor: '',
        className: 'td--dropdown-container',
        width: 30,
        Cell: ({ original: file }) => (
          <Dropdown id={`file_${file.id}`} className="deal-file-cta-menu" pullRight>
            <Button
              onClick={e => e.stopPropagation()}
              className="cta-btn btn-link"
              bsRole="toggle"
            >
              <VerticalDotsIcon fill="#D7DEE2" />
            </Button>

            <Dropdown.Menu>
              <li>
                {isDeleting.indexOf(file.id) > -1 ? (
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
    const { isDeleting, selectedRows } = this.state
    const data = this.getAllFiles()

    if (data.length === 0) {
      return (
        <div className="table-container empty-table">
          <img src="/static/images/deals/dnd.png" alt="" />
          There is no uploaded files in this deal
        </div>
      )
    }

    return (
      <div className="table-container">
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
            <button className="button" onClick={() => this.splitMultipleFiles()}>
              Split PDFs
            </button>
          )}
        </div>

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
      </div>
    )
  }
}

export default connect(
  ({ deals }) => ({
    checklists: deals.checklists,
    tasks: deals.tasks
  }),
  {
    confirmation,
    getDeal,
    deleteAttachment,
    displaySplitter
  }
)(FileManager)

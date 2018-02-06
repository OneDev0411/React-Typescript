import React, { Fragment } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { Dropdown, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import { getDeal, displaySplitter } from '../../../../../store_actions/deals'
import Radio from '../components/radio'
import VerticalDotsIcon from '../../Partials/Svgs/VerticalDots'
import Search from '../../../../Partials/headerSearch'

export class FileManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      deleting: null,
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

  getColumns() {
    const { selectedRows, deleting } = this.state

    return [
      {
        id: 'radio',
        Header: '',
        accessor: '',
        width: 40,
        className: 'select-row',
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
        Header: '',
        accessor: '',
        className: 'td--dropdown-container',
        width: 30,
        Cell: props => (
          <Dropdown
            id={`file_${props.original.id}`}
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
                {deleting ? (
                  <span>
                    <i className="fa fa-spinner fa-spin" /> Deleting ...
                  </span>
                ) : (
                  <span>Delete file</span>
                )}
              </li>
            </Dropdown.Menu>
          </Dropdown>
        )
      }
    ]
  }

  render() {
    const { selectedRows } = this.state

    const data = this.getAllFiles()

    return (
      <div className="table-container">
        <Search
          onInputChange={filter => this.setState({ filter })}
          debounceTime={100}
          placeholder="Search all uploaded files in this deal…"
        />

        <div className="callToActions">
          {_.size(selectedRows) > 0 && (
            <button className="button inverse">Delete files</button>
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
          columns={this.getColumns()}
          getTdProps={this.onCellClick}
          sortable
          multiSort
          resizable
          filterable={false}
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
    getDeal,
    displaySplitter
  }
)(FileManager)

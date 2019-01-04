import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import Table from 'views/components/Grid/Table'
import { grey, primary } from 'views/utils/colors'

import { confirmation } from 'actions/confirmation'

import { getDealFiles } from 'models/Deal/helpers/get-deal-files'
import { getDealEnvelopeFiles } from 'models/Deal/helpers/get-deal-envelope-files'

import { syncDeleteFile } from 'actions/deals'

import UploadManager from '../../UploadManager'

import { SearchFiles } from '../Search'
import PdfSplitter from '../../PdfSplitter'

import { FileName } from './columns/Name'
import Folder from './columns/Folder'
import OptionsMenu from './columns/OptionsMenu'

class FileManager extends React.Component {
  state = {
    filter: '',
    isDeleting: [],
    selectedDocuments: null
  }

  actions = [
    {
      display: ({ selectedRows }) => selectedRows.length > 0,
      type: 'button',
      disabled: this.state.isDeleting.length > 0,
      onClick: (e, params) => this.requestDeleteSelectedFiles(e, params),
      text:
        this.state.isDeleting.length === 0
          ? 'Delete files'
          : `Deleting ${this.state.isDeleting.length} files`
    },
    {
      display: ({ selectedRows }) => this.getShowSplitAction(selectedRows),
      type: 'button',
      onClick: (e, params) => this.splitMultipleFiles(e, params),
      text: 'Split PDFs'
    }
  ]

  get Columns() {
    return [
      {
        id: 'name',
        header: 'Name',
        accessor: file => file.name,
        width: '65%',
        render: ({ rowData: file }) => (
          <FileName file={file} link={this.getFileLink(file)} />
        )
      },
      {
        header: 'Folder',
        accessor: 'task',
        width: '30%',
        render: ({ rowData: file }) => (
          <Folder deal={this.props.deal} file={file} />
        )
      },
      {
        render: ({ rowIndex, totalRows, rowData: file }) => (
          <OptionsMenu
            rowId={rowIndex + 1}
            totalRows={totalRows}
            isPdfDocument={this.isPdfDocument(file.mime)}
            handleSplit={this.splitSingleFile}
            handleDelete={this.deleteSingleFile}
            file={file}
          />
        )
      }
    ]
  }

  get Rows() {
    this.files = getDealFiles(this.props.deal)
    this.envelopeFiles = getDealEnvelopeFiles(this.props.deal)

    return this.files.concat(this.envelopeFiles)
  }

  applyFilesFilter = (file, task) => {
    const { filter } = this.state

    if (filter.length === 0) {
      return true
    }

    return (
      file.name.toLowerCase().includes(filter.toLowerCase()) ||
      (task && task.title.toLowerCase().includes(filter.toLowerCase()))
    )
  }

  getFileLink = file => {
    const taskId = file.task ? file.task.id : 'stash'
    const type = file.envelope ? 'envelope' : 'attachment'
    const id = file.envelope ? file.envelope.id : file.id

    return `/dashboard/deals/${this.props.deal.id}/view/${taskId}/${type}/${id}`
  }

  handleChangeSearchCriteria = filter => this.setState({ filter })

  handleClosePdfSplitter = () => this.setState({ selectedDocuments: null })

  splitSingleFile = file =>
    this.setState({
      selectedDocuments: [file]
    })

  splitMultipleFiles = (e, params) => {
    const files = this.Rows.filter(
      file =>
        params.selectedRows.includes(file.id) && this.isPdfDocument(file.mime)
    )

    this.setState({
      selectedDocuments: files
    })
  }

  deleteSingleFile = file => {
    this.deleteFiles({
      [file.id]: file.task ? this.props.tasks[file.task.id] : null
    })
  }

  requestDeleteSelectedFiles = (e, params) => {
    const list = {}

    this.Rows.forEach(row => {
      if (params.selectedRows.includes(row.id)) {
        list[row.id] = row.task ? this.props.tasks[row.task.id] : null
      }
    })

    this.props.confirmation({
      message: `Delete ${params.selectedRows.length} files?`,
      confirmLabel: 'Yes, Delete',
      onConfirm: () => this.deleteFiles(list, params)
    })
  }

  deleteFiles = async (files, params) => {
    const { isDeleting } = this.state

    this.setState({
      isDeleting: [...isDeleting, ...Object.keys(files)]
    })

    try {
      await this.props.syncDeleteFile(this.props.deal.id, files)
      params.resetSelectedRows()
    } catch (e) {
      console.log(e)
    }

    this.setState({
      isDeleting: isDeleting.filter(id => files[id] !== null)
    })
  }

  getTrProps = (rowIndex, { original: row }) => ({
    style: {
      opacity: this.state.isDeleting.includes(row.id) ? 0.2 : 1
    },
    hoverStyle: `
      background-color: ${grey.A000};
      
      a {
        color: ${primary}
      }
      
      .btn--split-pdf{
        display: block !important;
      }
    `
  })

  getTdProps = (rowIndex, { column }) => {
    if (column.id !== 'name') {
      return {
        style: {
          alignSelf: 'center'
        }
      }
    }

    return {}
  }

  onChangeSelectedRows = () => {
    // todo
  }

  getShowSplitAction = selectedRows =>
    selectedRows.some(fileId => {
      const file = this.Rows.find(({ id }) => id === fileId)

      return file && this.isPdfDocument(file.mime)
    })

  isPdfDocument = mime => mime === 'application/pdf'

  get EnvelopeFiles() {
    return this.envelopeFiles || []
  }

  render() {
    const tableData = this.Rows

    return (
      <Fragment>
        <SearchFiles onSearch={this.handleChangeSearchCriteria} />

        <UploadManager deal={this.props.deal} disableClick>
          <Table
            plugins={{
              sortable: {},
              selectable: {
                persistent: false,
                onChange: this.onChangeSelectedRows,
                allowSelectAll: this.EnvelopeFiles.length === 0,
                unselectableRow: this.EnvelopeFiles.map(envelop => envelop.id)
              },
              actionable: {
                actions: this.actions
              }
            }}
            data={tableData}
            summary={{
              entityName: 'Files'
            }}
            columns={this.Columns}
            getTdProps={this.getTdProps}
            getTrProps={this.getTrProps}
          />
        </UploadManager>

        {this.state.selectedDocuments && (
          <PdfSplitter
            files={this.state.selectedDocuments}
            deal={this.props.deal}
            onClose={this.handleClosePdfSplitter}
          />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return {
    checklists: deals.checklists,
    tasks: deals.tasks,
    envelopes: deals.envelopes,
    user
  }
}

export default connect(
  mapStateToProps,
  { syncDeleteFile, confirmation }
)(FileManager)

import React from 'react'

import fileSaver from 'file-saver'
import { connect } from 'react-redux'
import superagent from 'superagent'

import { selectActiveBrandId } from '@app/selectors/brand'
import removeSpecialCharacters from 'utils/remove-special-characters'

import { ExportButton } from './ExportButton'

class ExportContacts extends React.Component {
  sendDownloadRequest = async exportType => {
    const {
      conditionOperator: filter_type,
      activeBrandId,
      excludedRows,
      searchText,
      exportIds,
      crmTasks,
      filters,
      parked,
      flows,
      users
    } = this.props
    const url = `/api/contacts/export/outlook/${activeBrandId}`

    const params = {
      type: exportType
    }

    if (Array.isArray(exportIds) && exportIds.length > 0) {
      params.ids = exportIds
    } else {
      params.filter_type = filter_type

      if (Array.isArray(filters) && filters.length > 0) {
        params.filters = filters.map(
          ({ attribute_def, invert, operator, value }) => ({
            attribute_def,
            invert,
            operator,
            value
          })
        )
      }

      const cleanedSearchText = removeSpecialCharacters(searchText)

      if (cleanedSearchText.length > 0) {
        params.query = cleanedSearchText
      } else {
        params.parked = parked
      }

      if (Array.isArray(excludedRows) && excludedRows.length > 0) {
        params.excludes = excludedRows
      }

      if (Array.isArray(crmTasks) && crmTasks.length > 0) {
        params.crm_tasks = crmTasks
      }

      if (Array.isArray(flows) && flows.length > 0) {
        params.flows = flows
      }
    }

    if (Array.isArray(users) && users.length > 0) {
      params.users = users
    }

    const response = await superagent.post(url).send(params)
    const blob = new Blob([response.text], { type: 'text/csv' })

    fileSaver.saveAs(blob, response.headers['x-rechat-filename'])
  }

  render() {
    return (
      <ExportButton
        disabled={this.props.disabled}
        onExportClick={this.sendDownloadRequest}
      />
    )
  }
}

function mapStateToProps(state) {
  return { activeBrandId: selectActiveBrandId(state) }
}

export default connect(mapStateToProps)(ExportContacts)

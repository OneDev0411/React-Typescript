import React from 'react'
import fileSaver from 'file-saver'
import superagent from 'superagent'
import { connect } from 'react-redux'

import config from 'config'

import removeSpecialCharacters from 'utils/remove-special-characters'
import { getActiveTeamId } from 'utils/user-teams'

import { ExportButton } from './ExportButton'

class ExportContacts extends React.Component {
  sendDownloadReuqest = async exportType => {
    const {
      excludedRows,
      exportIds,
      filters,
      flows,
      crmTasks,
      user,
      users,
      searchText,
      conditionOperator: filter_type
    } = this.props
    const activeBrand = getActiveTeamId(user)
    const url = `${config.proxy.url}/api/contacts/export/outlook/${activeBrand}`

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
        onExportClick={this.sendDownloadReuqest}
      />
    )
  }
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(ExportContacts)

import React from 'react'
import fileSaver from 'file-saver'
import superagent from 'superagent'
import { connect } from 'react-redux'

import { cleanSearchQuery } from 'utils/clean-search-query'
import { getActiveTeamId } from 'utils/user-teams'

import ExportButton from './button'

class ExportContacts extends React.Component {
  sendDownloadReuqest = async exportType => {
    const {
      excludedRows,
      exportIds,
      filters,
      user,
      users,
      searchText,
      conditionOperator: filter_type
    } = this.props
    const activeBrand = getActiveTeamId(user)
    const url = `/api/contacts/export/outlook/${activeBrand}/`

    const params = {
      type: exportType
    }

    if (Array.isArray(exportIds) && exportIds.length > 0) {
      params.ids = exportIds
    } else if (Array.isArray(filters) && filters.length > 0) {
      params.filter_type = filter_type

      params.filters = filters.map(
        ({ attribute_def, invert, operator, value }) => ({
          attribute_def,
          invert,
          operator,
          value
        })
      )

      const cleanedSearchText = cleanSearchQuery(searchText.trim())

      if (cleanedSearchText.length > 0) {
        params.query = cleanedSearchText
      }

      if (Array.isArray(excludedRows) && excludedRows.length > 0) {
        params.excludes = excludedRows
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

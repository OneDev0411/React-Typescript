import React from 'react'
import fileSaver from 'file-saver'
import superagent from 'superagent'
import { connect } from 'react-redux'

import { getActiveTeamId } from 'utils/user-teams'

import ExportButton from './button'

class ExportContacts extends React.Component {
  sendDownloadReuqest = async exportType => {
    const { exportIds, filters, user, users } = this.props
    const activeBrand = getActiveTeamId(user)
    const url = `/api/contacts/export/outlook/${activeBrand}/`

    const params = {
      type: exportType
    }

    if (Array.isArray(exportIds) && exportIds.length > 0) {
      params.ids = exportIds
    } else {
      const filtersExits = filters && typeof filters === 'object'

      if (filtersExits) {
        params.filters = filters.map(filter =>
          encodeURIComponent(JSON.stringify(filter))
        )
      }

      if (users && typeof users === 'object') {
        params.users = users.map(user => encodeURIComponent(user))
      }
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

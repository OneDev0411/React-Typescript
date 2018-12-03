import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import superagent from 'superagent'
import fileSaver from 'file-saver'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import { getActiveTeam } from '../../../../../../utils/user-teams'
import XlsxIcon from '../../../../../../views/components/SvgIcons/Xlsx/XlsxIcon'

const Button = ActionButton.withComponent('a')
const Xlsx = styled(XlsxIcon)`
  margin-right: 0.5rem;
`

const ExportContacts = ({ exportIds, disabled, filters, user, users }) => {
  const activeTeam = getActiveTeam(user)
  const activeBrand = activeTeam.brand.id
  const url = `/api/contacts/export/outlook/${activeBrand}/`

  const params = {}

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

  return (
    <Button
      appearance="outline"
      disabled={disabled}
      size="small"
      onClick={() => sendDownloadReuqest(url, params)}
    >
      <Xlsx />
      Export to Spreadsheet
    </Button>
  )
}

async function sendDownloadReuqest(url, params) {
  const response = await superagent.post(url).send(params)
  const blob = new Blob([response.text], { type: 'text/csv' })

  fileSaver.saveAs(blob, response.headers['x-rechat-filename'])
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(ExportContacts)

import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

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
  let url = `/api/contacts/export/outlook/${activeBrand}/`

  if (Array.isArray(exportIds) && exportIds.length > 0) {
    url = `${url}?ids[]=${exportIds.join('&ids[]=')}`
  } else {
    const filtersExits = filters && typeof filters === 'object'

    if (filtersExits) {
      url = `${url}?filters[]=${filters
        .map(filter => encodeURIComponent(JSON.stringify(filter)))
        .join('&filters[]=')}`
    }

    if (users && typeof users === 'object') {
      url += filtersExits ? '&' : '?'
      url = `${url}users[]=${users
        .map(user => encodeURIComponent(user))
        .join('&users[]=')}`
    }
  }

  return (
    <Button
      appearance="outline"
      disabled={disabled}
      size="small"
      as="a"
      href={url}
    >
      <Xlsx />
      Export to Spreadsheet
    </Button>
  )
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(ExportContacts)

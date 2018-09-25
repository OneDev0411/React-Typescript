import React from 'react'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

const Button = ActionButton.withComponent('a')

export default ({ exportIds, disabled, filters }) => {
  let url = '/api/contacts/export/outlook'

  if (Array.isArray(exportIds) && exportIds.length > 0) {
    url = `${url}?ids[]=${exportIds.join('&ids[]=')}`
  } else if (filters && typeof filters === 'object') {
    url = `${url}?filters[]=${filters
      .map(filter => encodeURIComponent(JSON.stringify(filter)))
      .join('&filters[]=')}`
  }

  return (
    <Button
      appearance="outline"
      disabled={disabled}
      size="small"
      as="a"
      href={url}
    >
      Export to Spreadsheet
    </Button>
  )
}

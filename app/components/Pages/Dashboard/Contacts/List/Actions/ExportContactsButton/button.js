import React from 'react'
import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'
import XlsxIcon from 'components/SvgIcons/Xlsx/XlsxIcon'

const Xlsx = styled(XlsxIcon)`
  margin-right: 0.5rem;
`

export default function ExportButton({ disabled, onClick }) {
  return (
    <ActionButton
      appearance="outline"
      disabled={disabled}
      size="small"
      onClick={onClick}
    >
      <Xlsx />
      Export to Spreadsheet
    </ActionButton>
  )
}

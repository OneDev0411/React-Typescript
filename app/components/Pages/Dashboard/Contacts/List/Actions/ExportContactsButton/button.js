import React from 'react'
import styled from 'styled-components'

import { BasicDropdown } from 'components/BasicDropdown'
import XlsxIcon from 'components/SvgIcons/Xlsx/XlsxIcon'

import Item from './item'
import { DOWNLOAD_TYPES_DROPDOWN_ITEMS } from './constants'

const Xlsx = styled(XlsxIcon)`
  margin-right: 0.5rem;
`

export default function ExportButton({ disabled, onExportClick }) {
  return (
    <BasicDropdown
      buttonSize="small"
      items={DOWNLOAD_TYPES_DROPDOWN_ITEMS}
      buttonIcon={Xlsx}
      onChange={async item => onExportClick(item.type)}
      buttonText="Export Contacts"
      disabled={disabled}
      menuStyle={{ width: '350px', overflow: 'hidden' }}
      itemRenderer={({ item, ...rest }) => (
        <Item
          key={item.type}
          title={item.title}
          description={item.description}
          {...rest}
        />
      )}
    />
  )
}

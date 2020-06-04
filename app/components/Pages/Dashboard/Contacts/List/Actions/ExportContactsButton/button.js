import React from 'react'

import { BasicDropdown } from 'components/BasicDropdown'
import { DropdownToggleButton } from 'components/DropdownToggleButton'

import Item from './item'
import { DOWNLOAD_TYPES_DROPDOWN_ITEMS } from './constants'

export default function ExportButton({ disabled, onExportClick }) {
  return (
    <BasicDropdown
      selectedItem={null}
      items={DOWNLOAD_TYPES_DROPDOWN_ITEMS}
      onChange={async item => onExportClick(item.type)}
      buttonText="Export"
      pullTo="right"
      disabled={disabled}
      style={{ display: 'inline' }}
      upsideDown
      fullHeight
      buttonRenderer={({ text, isOpen, disabled, onClick }) => (
        <DropdownToggleButton
          variant="outlined"
          size="small"
          disabled={disabled}
          onClick={onClick}
          isActive={isOpen}
        >
          {text}
        </DropdownToggleButton>
      )}
      itemRenderer={({ item, ...rest }) => (
        <Item
          key={item.type}
          icon={item.icon}
          title={item.title}
          description={item.description}
          {...rest}
        />
      )}
    />
  )
}

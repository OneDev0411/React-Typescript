import React from 'react'

import { Button } from '@material-ui/core'

import { BasicDropdown } from 'components/BasicDropdown'
import ArrowUp from 'components/SvgIcons/KeyboardArrowUp/IconKeyboardArrowUp'
import ArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import Item from './item'
import { DOWNLOAD_TYPES_DROPDOWN_ITEMS } from './constants'

export default function ExportButton({ disabled, onExportClick }) {
  return (
    <BasicDropdown
      selectedItem={null}
      items={DOWNLOAD_TYPES_DROPDOWN_ITEMS}
      onChange={async item => onExportClick(item.type)}
      buttonText="Export"
      upsideDown
      disabled={disabled}
      style={{ display: 'inline' }}
      buttonRenderer={({ text, isOpen, disabled, onClick }) => (
        <Button
          variant="outlined"
          size="small"
          disabled={disabled}
          onClick={onClick}
        >
          {text}
          {isOpen ? (
            <ArrowUp
              style={{ width: 16, height: 16, verticalAlign: 'middle' }}
            />
          ) : (
            <ArrowDown
              style={{ width: 16, height: 16, verticalAlign: 'middle' }}
            />
          )}
        </Button>
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

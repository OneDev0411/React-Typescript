import { List, ListItem } from '@material-ui/core'
import * as React from 'react'

import IconDealFilled from 'components/SvgIcons/Deals/IconDealFilled'
import IconDropbox from 'components/SvgIcons/Dropbox/IconDropbox'
import IconUpload from 'components/SvgIcons/Upload/IconUpload'

import { useIconStyles } from '../../../../../styles/icon.styles'
import { BaseDropdown } from '../../../BaseDropdown'

const iconSize = { width: 16, height: 16 }

export function EmailAttachmentsDropdown() {
  const iconClasses = useIconStyles()

  const addDealFile = () => {}
  const attachFromDropbox = () => {}
  const uploadFromYourComputer = () => {}

  return (
    <>
      <BaseDropdown
        buttonLabel="Attachments"
        renderMenu={({ toggle }) => (
          <List
            style={{
              minWidth: '15rem',
              maxHeight: '25rem',
              overflow: 'auto'
            }}
          >
            <ListItem
              button
              onClick={() => {
                addDealFile()
                toggle()
              }}
            >
              <IconDealFilled
                size={iconSize}
                className={iconClasses.rightMargin}
              />
              Add from Deals
            </ListItem>
            <ListItem
              button
              onClick={() => {
                attachFromDropbox()
                toggle()
              }}
            >
              <IconDropbox
                size={iconSize}
                className={iconClasses.rightMargin}
              />
              Attach from Dropbox
            </ListItem>
            <ListItem
              button
              onClick={() => {
                uploadFromYourComputer()
                toggle()
              }}
            >
              <IconUpload size={iconSize} className={iconClasses.rightMargin} />
              Attach from your computer
            </ListItem>
          </List>
        )}
      />
    </>
  )
}

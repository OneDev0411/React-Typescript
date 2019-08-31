import { List, ListItem } from '@material-ui/core'
import * as React from 'react'

import { Field } from 'react-final-form'

import IconUpload from 'components/SvgIcons/Upload/IconUpload'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { useIconStyles } from '../../../../../styles/icon.styles'
import { BaseDropdown } from '../../../BaseDropdown'
import { FilePicker } from '../../../FilePicker'
import AddDealFile from '../AddDealFile'
import { EmailComposeDrawerProps } from '../../types'
import { iconSizes } from '../../../SvgIcons/icon-sizes'

interface Props {
  deal: IDeal
  initialAttachments: Required<
    EmailComposeDrawerProps
  >['initialValues']['attachments']
}

export function EmailAttachmentsDropdown({ deal, initialAttachments }: Props) {
  const iconClasses = useIconStyles()

  const uploadFromYourComputer = (files: FileList) => {
    console.log('files', files)
    uploadEmailAttachment(files[0])
  }

  return (
    <BaseDropdown
      buttonLabel="Attachments"
      PopperProps={{ keepMounted: true }}
      renderMenu={({ close }) => (
        <List>
          <Field
            name="attachments"
            deal={deal}
            initialAttachments={initialAttachments}
            component={AddDealFile}
            onClick={close}
          />
          <FilePicker onFilePicked={uploadFromYourComputer}>
            {({ pickFiles }) => (
              <ListItem
                button
                onClick={() => {
                  pickFiles()
                  close()
                }}
              >
                <IconUpload
                  size={iconSizes.small}
                  className={iconClasses.rightMargin}
                />
                Attach from your computer
              </ListItem>
            )}
          </FilePicker>
        </List>
      )}
    />
  )
}
